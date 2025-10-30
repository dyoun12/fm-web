type ClassValue = string | false | null | undefined;

/**
 * 간단한 클래스 결합 유틸리티.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
