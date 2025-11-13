export type Post = {
  postId: string;
  category: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
};

export type ListPostsResponse = { items: Post[]; count: number };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001"; // falls back to backend dev server
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || "local-dev-token";
const mutateHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` } as const;

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

export async function listPosts(params: { category?: string; q?: string } = {}): Promise<ListPostsResponse> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.q) qs.set("q", params.q);
  const r = await fetch(`${API_BASE}/v1/posts?${qs.toString()}`);
  return unwrap<ListPostsResponse>(await r.json());
}

export async function getPost(id: string): Promise<Post> {
  const r = await fetch(`${API_BASE}/v1/posts/${id}`);
  return unwrap<Post>(await r.json());
}

export async function createPost(payload: { category: string; title: string; content: string; thumbnailUrl?: string }): Promise<Post> {
  const r = await fetch(`${API_BASE}/v1/posts`, {
    method: "POST",
    headers: mutateHeaders,
    body: JSON.stringify(payload),
  });
  return unwrap<Post>(await r.json());
}

export async function updatePost(id: string, payload: Partial<Omit<Post, "postId" | "createdAt" | "updatedAt">>): Promise<Post> {
  const r = await fetch(`${API_BASE}/v1/posts/${id}`, {
    method: "PUT",
    headers: mutateHeaders,
    body: JSON.stringify(payload),
  });
  return unwrap<Post>(await r.json());
}

export async function deletePost(id: string): Promise<{ deleted: boolean; postId: string }> {
  const r = await fetch(`${API_BASE}/v1/posts/${id}`, { method: "DELETE", headers: mutateHeaders });
  return unwrap<{ deleted: boolean; postId: string }>(await r.json());
}
