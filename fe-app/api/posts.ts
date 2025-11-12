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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // e.g., "" when same origin, or "https://api.example.com"
const headers = { "Content-Type": "application/json" } as const;

function unwrap<T>(res: any): T {
  if (!res || res.success !== true) throw new Error(res?.error?.message || "API_ERROR");
  return res.data as T;
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
    headers,
    body: JSON.stringify(payload),
  });
  return unwrap<Post>(await r.json());
}

export async function updatePost(id: string, payload: Partial<Omit<Post, "postId" | "createdAt" | "updatedAt">>): Promise<Post> {
  const r = await fetch(`${API_BASE}/v1/posts/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return unwrap<Post>(await r.json());
}

export async function deletePost(id: string): Promise<{ deleted: boolean; postId: string }> {
  const r = await fetch(`${API_BASE}/v1/posts/${id}`, { method: "DELETE" });
  return unwrap<{ deleted: boolean; postId: string }>(await r.json());
}

