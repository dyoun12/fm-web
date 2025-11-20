import { Suspense } from "react";
import AuthCallback from "./AuthCallback";

export default function Page() {
  return (
    <Suspense fallback={
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-700">로그인 처리 중입니다. 잠시만 기다려 주세요…</p>
      </main>
    }>
      <AuthCallback />
    </Suspense>
  );
}
