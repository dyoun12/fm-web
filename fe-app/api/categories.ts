export type Category = {
  categoryId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type ListCategoriesResponse = { items: Category[] };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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

