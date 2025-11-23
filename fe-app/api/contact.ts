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

export type ContactInquiryInput = {
  company?: string;
  title?: string;
  name: string;
  email: string;
  referral?: string;
  subject?: string;
  message: string;
};

export type ContactInquiry = {
  inquiryId: string;
  company?: string;
  title?: string;
  name: string;
  email: string;
  referral?: string;
  subject?: string;
  message: string;
  status?: string;
  notifiedEmail?: string;
  createdAt: string;
  updatedAt: string;
};

export type ListContactInquiryResponse = {
  items: ContactInquiry[];
  count: number;
};

export type ContactInquiryResponse = {
  inquiryId: string;
  createdAt: string;
};

export async function postContactInquiry(payload: ContactInquiryInput): Promise<ContactInquiryResponse> {
  const r = await fetch(`${API_BASE}/v1/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return unwrap<ContactInquiryResponse>(await r.json());
}

export async function listContactInquiries(): Promise<ListContactInquiryResponse> {
  const r = await fetch(`${API_BASE}/v1/contact`);
  return unwrap<ListContactInquiryResponse>(await r.json());
}
