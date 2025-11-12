"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/classnames";
import { Button } from "../../atoms/button/button";

export type HeaderNavigationItem = {
  label: string;
  href: string;
  isActive?: boolean;
  external?: boolean;
};

export type GlobalHeaderProps = {
  logo?: {
    src: string;
    alt: string;
  };
  brandName?: string;
  navigation: HeaderNavigationItem[];
  cta?: {
    label: string;
    href: string;
  };
  isSticky?: boolean;
  theme?: "light" | "dark" | "contact";
};

export function GlobalHeader({
  logo,
  // brandName reserved for future use
  navigation,
  cta,
  isSticky = true,
  theme = "light",
}: GlobalHeaderProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MENU_TRANSITION_MS = 300;
  const topbarRef = useRef<HTMLDivElement | null>(null);
  // 모바일 기본 헤더 높이(초깃값): 56px (py-2 + 로고 h-12 기준)
  const [topbarHeight, setTopbarHeight] = useState<number>(56);
  const isContact = theme === "contact";
  const isDark = theme === "dark" || isContact;
  const linkHover = isContact ? "hover:text-[var(--link-color-hover)]" : "hover:text-blue-600";
  const linkActive = isContact ? "text-[var(--link-color-hover)]" : "text-blue-600";
  const isOverlayActive = isMenuOpen || isClosing;
  const [isScrolled, setIsScrolled] = useState(false);
  const menuScrollRef = useRef<HTMLDivElement | null>(null);
  const [isMenuScrollable, setIsMenuScrollable] = useState(false);
  const dragState = useRef<{ isDown: boolean; startX: number; scrollLeft: number }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  // 상단 바 실제 높이를 측정해 스페이서에 반영(모바일 레이아웃 점프 방지)
  useEffect(() => {
    const measure = () => {
      if (topbarRef.current) {
        const h = topbarRef.current.offsetHeight;
        if (h) setTopbarHeight(h);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isOverlayActive]);

  // 스크롤 시 컨택트 테마에서 헤더 배경을 강화하기 위한 플래그
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 모바일 메뉴 가로 폭 측정하여 중앙 정렬/드래그 가능 여부 결정
  useEffect(() => {
    const measureMenu = () => {
      const el = menuScrollRef.current;
      if (!el) return;
      const scrollable = el.scrollWidth > el.clientWidth + 1; // 여유 1px
      setIsMenuScrollable(scrollable);
    };
    measureMenu();
    window.addEventListener("resize", measureMenu);
    return () => window.removeEventListener("resize", measureMenu);
  }, [navigation, isOverlayActive]);

  return (
    <>
    <header
      className={cn(
        "top-0 z-30 w-full backdrop-blur transition-all",
        // 헤더 테두리 제거: 배경만 적용. 컨택트 테마의 배경은 CSS에서 제어됨(투명/강조).
        isDark ? "bg-zinc-900/80" : "bg-white/80",
        // 메뉴 오픈/닫힘 트랜지션 동안에도 fixed 유지하여 본문 점프 방지
        isOverlayActive ? "fixed" : isSticky ? "sticky" : "relative",
      )}
      data-elevated={isContact && (isOverlayActive || isScrolled) ? "true" : undefined}
    >
      <div
        ref={topbarRef}
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2 lg:px-6 lg:py-4"
      >
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.src}
              alt={logo.alt}
              className={cn("h-12 w-auto lg:h-20", isContact && "brightness-0 invert")}
              loading="lazy"
            />
          ) : (
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold lg:h-20 lg:w-20 lg:text-xl",
                isContact
                  ? "border-2 border-white text-white"
                  : "bg-blue-600 text-white",
              )}
            >
              FM
            </span>
          )}
        </Link>

        <nav className={cn("hidden items-center gap-6 text-sm font-medium lg:flex", isDark ? "text-zinc-300" : "text-zinc-600") }>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "transition",
                linkHover,
                item.isActive && linkActive,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {cta && (
            <Button asChild theme={theme}>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg lg:hidden",
            // 테두리 제거, 테마별 아이콘 색상
            isContact ? "text-white" : "text-zinc-600",
          )}
          aria-label="모바일 메뉴 토글"
          aria-expanded={isMenuOpen}
          onClick={() => {
            if (isMenuOpen) {
              setIsClosing(true);
              setMenuOpen(false);
              if (closeTimer.current) clearTimeout(closeTimer.current);
              closeTimer.current = setTimeout(() => {
                setIsClosing(false);
                closeTimer.current = null;
              }, MENU_TRANSITION_MS);
            } else {
              // 열기: 즉시 오버레이 활성화, closing 플래그 해제
              if (closeTimer.current) {
                clearTimeout(closeTimer.current);
                closeTimer.current = null;
              }
              setIsClosing(false);
              setMenuOpen(true);
            }
          }}
        >
          <span className="sr-only">{isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
          <i
            className={cn(
              "text-xl",
              isMenuOpen ? "ri-close-line" : "ri-menu-line",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 모바일 메뉴: 헤더 내부에 접힘 패널로 구성하여 백드롭/경계가 끊기지 않도록 처리 */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className={cn("mx-auto w-full max-w-6xl px-6 pb-4", isDark ? "text-zinc-300" : "text-zinc-700") }>
          <div className={cn(
            // 헤더와 메뉴 분리 선: 컨택트 테마에서도 라이트 테마와 동일한 색상 사용
            isContact ? "border-t border-zinc-300" : isDark ? "border-t border-zinc-800" : "border-t border-zinc-100",
            "pt-4",
          )}></div>
          {/* 모바일 메뉴: 가로 배열 + 조건부 중앙 정렬/드래그 스크롤 */}
          <div
            ref={menuScrollRef}
            className={cn(
              "flex w-full py-1",
              isMenuScrollable
                ? "gap-4 overflow-x-auto justify-start cursor-grab active:cursor-grabbing"
                : "gap-2 overflow-x-hidden justify-between",
            )}
            onMouseDown={(e) => {
              if (!isMenuScrollable) return;
              const el = menuScrollRef.current;
              if (!el) return;
              dragState.current.isDown = true;
              dragState.current.startX = e.pageX - el.offsetLeft;
              dragState.current.scrollLeft = el.scrollLeft;
            }}
            onMouseLeave={() => {
              if (!isMenuScrollable) return;
              dragState.current.isDown = false;
            }}
            onMouseUp={() => {
              if (!isMenuScrollable) return;
              dragState.current.isDown = false;
            }}
            onMouseMove={(e) => {
              if (!isMenuScrollable) return;
              if (!dragState.current.isDown) return;
              e.preventDefault();
              const el = menuScrollRef.current;
              if (!el) return;
              const x = e.pageX - el.offsetLeft;
              const walk = x - dragState.current.startX;
              el.scrollLeft = dragState.current.scrollLeft - walk;
            }}
            onTouchStart={(e) => {
              if (!isMenuScrollable) return;
              const el = menuScrollRef.current;
              if (!el) return;
              const touch = e.touches[0];
              dragState.current.isDown = true;
              dragState.current.startX = touch.pageX - el.offsetLeft;
              dragState.current.scrollLeft = el.scrollLeft;
            }}
            onTouchEnd={() => {
              if (!isMenuScrollable) return;
              dragState.current.isDown = false;
            }}
            onTouchMove={(e) => {
              if (!isMenuScrollable) return;
              if (!dragState.current.isDown) return;
              const el = menuScrollRef.current;
              if (!el) return;
              const touch = e.touches[0];
              const x = touch.pageX - el.offsetLeft;
              const walk = x - dragState.current.startX;
              el.scrollLeft = dragState.current.scrollLeft - walk;
            }}
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 text-sm font-medium transition",
                  isMenuScrollable
                    ? "py-2 flex-shrink-0"
                    : "py-3 flex-1 text-center",
                  linkHover,
                  item.isActive && linkActive,
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {cta && (
            <div className="mt-6">
              <Button asChild fullWidth theme={theme}>
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            </div>
          )}
        </div>
        {/* 패널 래퍼 닫기 */}
      </div>
    </header>
    {/* 메뉴 오픈/닫힘 트랜지션 동안 본문 위치 보정: 측정된 상단 바 높이만큼 공간 확보 (모바일 전용) */}
    {isOverlayActive && (
      <div className="lg:hidden" style={{ height: topbarHeight }} aria-hidden="true" />
    )}
    </>
  );
}
