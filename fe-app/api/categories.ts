export type Category = {
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  order?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ListCategoriesResponse = { items: Category[] };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || "local-dev-token";
const mutateHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${ADMIN_TOKEN}`,
} as const;

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

export async function listCategories(): Promise<ListCategoriesResponse> {
  const r = await fetch(`${API_BASE}/v1/categories`);
  return unwrap<ListCategoriesResponse>(await r.json());
}

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  order?: number;
};

export async function createCategory(payload: CreateCategoryInput): Promise<Category> {
  const r = await fetch(`${API_BASE}/v1/categories`, {
    method: "POST",
    headers: mutateHeaders,
    body: JSON.stringify(payload),
  });
  return unwrap<Category>(await r.json());
}
