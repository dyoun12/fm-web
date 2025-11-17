"use client";

import { useEffect, useState } from "react";
import { listCorpMeta, type CorpMeta } from "@/api/corp-meta";

export function useCorpMeta() {
  const [corpMeta, setCorpMeta] = useState<CorpMeta | null>(null);

  useEffect(() => {
    let mounted = true;

    listCorpMeta()
      .then((res) => {
        if (!mounted) return;
        setCorpMeta(res.items?.[0] ?? null);
      })
      .catch((err) => {
        console.error("회사 정보를 불러오는 데 실패했습니다.", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return corpMeta;
}
