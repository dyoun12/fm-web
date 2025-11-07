"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../../../components/atoms/input/input";
import { Select } from "../../../components/atoms/select/select";
import { TextArea } from "../../../components/atoms/text-area/text-area";
import { Button } from "../../../components/atoms/button/button";
import Link from "next/link";
import { Card } from "../../../components/atoms/card/card";

export default function AdminPostEditPage() {
  const router = useRouter();
  const params = useSearchParams();
  const postId = params.get("id");

  return (
    <div className="grid gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {postId ? "게시물 편집" : "새 게시물"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            제목, 카테고리, 본문을 입력해 게시물을 {postId ? "수정" : "생성"}합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" color="neutral" asChild>
            <Link href="/admin/posts">취소</Link>
          </Button>
          <Button onClick={() => router.push("/admin/posts")}>저장</Button>
        </div>
      </header>

      <Card padding="lg">
        <form className="grid grid-cols-1 gap-6" onSubmit={(e) => e.preventDefault()}>
          <Input label="제목" placeholder="제목을 입력하세요" required />
          <Select
            aria-label="카테고리"
            placeholder="카테고리 선택"
            options={[
              { label: "IR", value: "ir" },
              { label: "공지", value: "notice" },
            ]}
          />
          <TextArea label="본문" placeholder="내용을 입력하세요" rows={12} required />

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" color="neutral" asChild>
              <Link href="/admin/posts">취소</Link>
            </Button>
            <Button type="submit" onClick={() => router.push("/admin/posts")}>
              저장
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

