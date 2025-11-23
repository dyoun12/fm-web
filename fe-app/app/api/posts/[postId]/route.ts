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

type Params = { params: Promise<{ postId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { postId } = await params;

  try {
    const headers = await buildAuthHeaders();
    const r = await fetch(`${API_BASE}/v1/posts/${postId}`, { headers });
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "POST_DETAIL_FAILED";
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { postId } = await params;
  const body = await request.json();

  try {
    const headers = await buildAuthHeaders();
    const r = await fetch(`${API_BASE}/v1/posts/${postId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "POST_UPDATE_FAILED";
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { postId } = await params;

  try {
    const headers = await buildAuthHeaders();
    const r = await fetch(`${API_BASE}/v1/posts/${postId}`, {
      method: "DELETE",
      headers,
    });
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "POST_DELETE_FAILED";
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

