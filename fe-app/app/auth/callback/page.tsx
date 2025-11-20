"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      setError("로그인 코드가 없습니다.");
      setLoading(false);
      return;
    }

    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code, redirectUri }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const msg =
            body && body.error && body.error.message
              ? String(body.error.message)
              : `로그인 처리에 실패했습니다. (status ${res.status})`;
          throw new Error(msg);
        }
        // 성공 시 원래 이동하려던 경로(state) 또는 /admin 으로 이동
        const target = state ? decodeURIComponent(state) : "/admin";
        router.replace(target);
      } catch (e: any) {
        setError(e?.message ?? "로그인 처리 중 오류가 발생했습니다.");
        setLoading(false);
      }
    })();
  }, [router, searchParams]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-700">로그인 처리 중입니다. 잠시만 기다려 주세요…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center gap-4 px-4">
      <h1 className="text-xl font-semibold">로그인에 실패했습니다.</h1>
      <p className="text-sm text-red-600">{error}</p>
      <button
        type="button"
        onClick={() => router.replace("/auth/login")}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
      >
        다시 로그인 시도
      </button>
    </main>
  );
}

