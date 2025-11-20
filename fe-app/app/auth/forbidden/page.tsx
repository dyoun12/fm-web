import Link from "next/link";
import { Button } from "@/app/components/atoms/button/button";

export default function AuthForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">이 페이지를 볼 수 있는 권한이 없습니다.</h1>
      <p className="text-sm text-gray-700">
        요청하신 페이지는 로그인된 사용자이거나, 특정 권한을 가진 사용자만 접근할 수 있습니다. 다른 계정으로
        로그인하거나, 권한이 필요하다면 관리자에게 문의해 주세요.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/auth/login">로그인하기</Link>
        </Button>
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-500 hover:underline">
          메인 페이지로 돌아가기
        </Link>
      </div>
    </main>
  );
}
