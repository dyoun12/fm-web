import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "fm_auth_token";

async function buildAuthHeaders(): Promise<HeadersInit> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof token === "string" && token.length > 0) {
    return { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
}

type Params = { params: Promise<{ inquiryId: string }> };

export async function POST(request: Request, { params }: Params) {
  const { inquiryId } = await params;
  const body = (await request.json()) as { status: string };

  try {
    const headers = await buildAuthHeaders();
    const r = await fetch(`${API_BASE}/v1/contact/${inquiryId}/status`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CONTACT_STATUS_UPDATE_FAILED";
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

