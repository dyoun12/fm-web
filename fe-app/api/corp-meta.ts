export type CorpMeta = {
  corpMetaId: string;
  address: string;
  corpNum: string;
  ceo: string;
  email: string;
  hp: string;
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE = ""; // use Next.js API routes (`/api/corpmeta`)

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

export type ListCorpMetaResponse = {
  items: CorpMeta[];
  count: number;
};

export async function listCorpMeta(): Promise<ListCorpMetaResponse> {
  const r = await fetch(`/api/corpmeta`);
  return unwrap<ListCorpMetaResponse>(await r.json());
}

export async function getCorpMeta(corpMetaId: string): Promise<CorpMeta> {
  const r = await fetch(`/api/corpmeta/${corpMetaId}`);
  return unwrap<CorpMeta>(await r.json());
}

export type CreateCorpMetaInput = {
  address?: string;
  corpNum?: string;
  ceo?: string;
  email?: string;
  hp?: string;
};

export async function createCorpMeta(payload: CreateCorpMetaInput): Promise<CorpMeta> {
  const r = await fetch(`/api/corpmeta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return unwrap<CorpMeta>(await r.json());
}

export type UpdateCorpMetaInput = {
  address?: string;
  corpNum?: string;
  ceo?: string;
  email?: string;
  hp?: string;
};

export async function updateCorpMeta(corpMetaId: string, payload: UpdateCorpMetaInput): Promise<CorpMeta> {
  const r = await fetch(`/api/corpmeta/${corpMetaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return unwrap<CorpMeta>(await r.json());
}

export async function deleteCorpMeta(corpMetaId: string): Promise<{ deleted: boolean; corpMetaId: string }> {
  const r = await fetch(`/api/corpmeta/${corpMetaId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return unwrap<{ deleted: boolean; corpMetaId: string }>(await r.json());
}
