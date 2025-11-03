"use client";

import { useEffect } from "react";

/**
 * Contact 페이지 전용 테마 스코프를 활성화한다.
 * - <html data-theme="contact"> 속성을 부여하여 globals.css의 토큰 오버라이드가 적용되도록 한다.
 * - 언마운트 시 원복한다.
 */
export function ContactBackground() {
  useEffect(() => {
    const root = document.documentElement; // <html>
    const prev = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "contact");
    return () => {
      if (prev) {
        root.setAttribute("data-theme", prev);
      } else {
        root.removeAttribute("data-theme");
      }
    };
  }, []);

  return null;
}
