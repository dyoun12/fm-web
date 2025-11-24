import type { JSONContent } from "@tiptap/react";

export type Post = {
  postId: string;
  category: string;
  title: string;
  content: JSONContent;
  thumbnailUrl?: string;
  author?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
};

export type ListPostsResponse = { items: Post[]; count: number };

// 읽기(GET)는 백엔드 `/v1/posts`를 직접 호출하고,
// 쓰기(POST/PUT/DELETE)는 Next API 라우트(`/api/posts`)를 통해 쿠키 기반 인증을 적용한다.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: { message?: string } | null;
};

function isApiEnvelope<T>(res: unknown): res is ApiEnvelope<T> {
  if (typeof res !== "object" || res === null) return false;
  const r = res as { success?: unknown; data?: unknown };
  return typeof r.success === "boolean" && ("data" in r || r.success === false);
}

function unwrap<T>(res: unknown): T {
  if (!isApiEnvelope<T>(res) || res.success !== true) {
    const err = isApiEnvelope<T>(res) ? res.error : null;
    const msg =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: unknown }).message ?? "API_ERROR")
        : "API_ERROR";
    throw new Error(msg);
  }
  return res.data;
}

export async function listPosts(
  params: { category?: string; q?: string } = {}
): Promise<ListPostsResponse> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.q) qs.set("q", params.q);

  const query = qs.toString();
  const url = query ? `${API_BASE}/v1/posts?${query}` : `${API_BASE}/v1/posts`;
  const r = await fetch(url);
  const raw = unwrap<ListPostsResponse>(await r.json());

  const items = raw.items.map((post) => {
    let parsedContent: JSONContent;

    try {
      parsedContent =
        typeof post.content === "string"
          ? (JSON.parse(post.content) as JSONContent)
          : post.content;
    } catch {
      parsedContent = { type: "doc", content: [] };
    }

    return {
      ...post,
      content: parsedContent,
    };
  });

  return { ...raw, items };
}

export async function getPost(id: string): Promise<Post> {
  const r = await fetch(`${API_BASE}/v1/posts/${id}`);
  const raw = unwrap<Post>(await r.json());

  // content가 string이면 JSONContent로 변환, 이미 JSONContent면 그대로 사용
  let parsedContent: JSONContent;

  try {
    parsedContent =
      typeof raw.content === "string"
        ? (JSON.parse(raw.content) as JSONContent)
        : raw.content;
  } catch {
    // 혹시라도 잘못된 JSON이 들어오면 최소한의 fallback
    parsedContent = { type: "doc", content: [] };
  }

  return {
    ...raw,
    content: parsedContent,
  };
}

export async function createPost(payload: {
  category: string;
  title: string;
  content: JSONContent | undefined;
  thumbnailUrl?: string;
  author?: string;
}): Promise<Post> {
  const body = {
    ...payload,
    content: payload.content ? JSON.stringify(payload.content) : undefined,
  };

  const r = await fetch(`/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return unwrap<Post>(await r.json());
}

export async function updatePost(id: string, payload: Partial<Omit<Post, "postId" | "createdAt" | "updatedAt">>): Promise<Post> {
  const r = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      content: JSON.stringify(payload.content)
    }),
  });
  return unwrap<Post>(await r.json());
}

export async function deletePost(id: string): Promise<{ deleted: boolean; postId: string }> {
  const r = await fetch(`/api/posts/${id}`, { method: "DELETE" });
  return unwrap<{ deleted: boolean; postId: string }>(await r.json());
}
