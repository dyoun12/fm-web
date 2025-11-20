"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

function decodeJwt(token: string) {
  try {
    const [headerB64, payloadB64] = token.split(".");
    const decode = (b64: string) =>
      JSON.parse(Buffer.from(b64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8"));
    return {
      header: decode(headerB64),
      payload: decode(payloadB64),
    };
  } catch {
    return null;
  }
}

export default function AuthForbiddenPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "unknown";
  const error = searchParams.get("error") || "";
  const roles = searchParams.get("roles") || "";
  const token = searchParams.get("token") || "";

  const decoded = useMemo(() => {
    if (!token) return null;
    return decodeJwt(token);
  }, [token]);

  // 디버깅 편의를 위해 콘솔에도 출력
  if (token) {
    // eslint-disable-next-line no-console
    console.groupCollapsed("[auth] Forbidden debug");
    // eslint-disable-next-line no-console
    console.log("reason:", reason);
    // eslint-disable-next-line no-console
    console.log("error:", error);
    // eslint-disable-next-line no-console
    console.log("roles:", roles);
    // eslint-disable-next-line no-console
    console.log("raw token:", token);
    if (decoded) {
      // eslint-disable-next-line no-console
      console.log("decoded header:", decoded.header);
      // eslint-disable-next-line no-console
      console.log("decoded payload:", decoded.payload);
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="text-xl font-semibold">접근이 거부되었습니다.</h1>
      <p className="text-sm text-gray-700">
        이 페이지는 인증/권한 문제 디버깅을 위한 용도로 제공됩니다. 운영 환경에서는 접근 로그와 서버 로그를 함께
        확인하세요.
      </p>

      <section className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
        <h2 className="mb-2 font-medium">요약</h2>
        <dl className="space-y-1">
          <div className="flex gap-2">
            <dt className="w-24 text-gray-500">reason</dt>
            <dd>{reason}</dd>
          </div>
          {error && (
            <div className="flex gap-2">
              <dt className="w-24 text-gray-500">error</dt>
              <dd className="text-red-600">{error}</dd>
            </div>
          )}
          {roles && (
            <div className="flex gap-2">
              <dt className="w-24 text-gray-500">roles</dt>
              <dd>{roles}</dd>
            </div>
          )}
        </dl>
      </section>

      {token && (
        <section className="rounded-md border border-gray-200 bg-gray-50 p-4 text-xs">
          <h2 className="mb-2 font-medium">JWT 토큰 (디버그용)</h2>
          <p className="mb-2 break-all text-gray-700">
            <span className="font-mono">{token}</span>
          </p>

          {decoded && (
            <details className="mt-2">
              <summary className="cursor-pointer text-gray-700">디코드된 페이로드 보기</summary>
              <pre className="mt-2 overflow-auto rounded bg-black/80 p-2 text-xs text-green-100">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </details>
          )}
        </section>
      )}
    </main>
  );
}

