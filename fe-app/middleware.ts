import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isAccessAllowed } from "./lib/auth/access-control";
import { verifyCognitoToken } from "./lib/auth/jwt";

const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "fm_auth_token";
const AUTH_DEBUG = process.env.NEXT_PUBLIC_AUTH_DEBUG ?? "1";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.headers.get("authorization")?.replace(/^[Bb]earer\s+/, "") ||
    null;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const { roles } = await verifyCognitoToken(token);
    if (!isAccessAllowed(pathname, roles)) {
      return redirectToForbidden(request, {
        reason: "role_denied",
        roles: roles.join(","),
      });
    }
    return NextResponse.next();
  } catch (error: unknown) {
    if (AUTH_DEBUG) {
      const errMessage = error instanceof Error ? error.message : String(error);
      return redirectToForbidden(request, {
        reason: "verify_failed",
        error: errMessage,
        token,
      });
    } else {
      // 디버그 비활성화 시에는 로그인 페이지로 유도
      console.log("else")
      // return redirectToLogin(request);
    }
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function redirectToForbidden(
  request: NextRequest,
  params?: { reason?: string; error?: string; roles?: string; token?: string },
) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/forbidden";
  if (params?.reason) url.searchParams.set("reason", params.reason);
  if (params?.error) url.searchParams.set("error", params.error);
  if (params?.roles) url.searchParams.set("roles", params.roles);
  if (params?.token) url.searchParams.set("token", params.token);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/secure/:path*", "/api/admin/:path*", "/dev"],
};
