export type AppRole = "fm-web:admin" | "fm-web:editor" | "fm-web:viewer";

export type Subject = {
  sub: string;
  email?: string;
  roles: AppRole[];
};

type RouteRule = {
  /** 보호할 경로 패턴 (prefix 기반 정규식) */
  pattern: RegExp;
  /** 이 경로에 접근 가능한 역할 목록 */
  allowedRoles: AppRole[];
};

/**
 * 경로별 접근 제어 규칙
 *
 * - `/admin/:path*` : fm-web:admin, fm-web:editor
 * - `/secure/:path*`: fm-web:admin, fm-web:editor, fm-web:viewer
 * - `/api/admin/:path*`: fm-web:admin
 *
 * 추후 필요 시 규칙 객체를 추가/수정하여 역할·경로 정책을 확장한다.
 */
const routeRules: RouteRule[] = [
  {
    pattern: /^\/admin(\/.*)?$/i,
    allowedRoles: ["fm-web:admin", "fm-web:editor"],
  },
  {
    pattern: /^\/secure(\/.*)?$/i,
    allowedRoles: ["fm-web:admin", "fm-web:editor", "fm-web:viewer"],
  },
  {
    pattern: /^\/api\/admin(\/.*)?$/i,
    allowedRoles: ["fm-web:admin"],
  },
];

/**
 * 주어진 경로에 필요한 역할 목록을 반환한다.
 * 규칙이 없는 경우 `null`을 반환하여 "제한 없음"을 의미한다.
 */
export function getRequiredRolesForPath(pathname: string): AppRole[] | null {
  const rule = routeRules.find((r) => r.pattern.test(pathname));
  return rule ? rule.allowedRoles : null;
}

/**
 * 사용자의 역할이 경로 접근 요건을 만족하는지 검사한다.
 * 규칙이 없는 경로는 모두 허용한다.
 */
export function isAccessAllowed(pathname: string, subjectRoles: AppRole[]): boolean {
  const required = getRequiredRolesForPath(pathname);
  if (!required || required.length === 0) return true;
  if (!subjectRoles || subjectRoles.length === 0) return false;
  return subjectRoles.some((role) => required.includes(role));
}

/**
 * Cognito JWT 클레임에서 애플리케이션 역할을 추출한다.
 * - `custom:role`: 단일 역할
 * - `cognito:groups`: 그룹 기반 역할 배열
 *
 * 클레임 값이 `fm-web:admin|fm-web:editor|fm-web:viewer` 중 하나일 때만 매핑한다.
 */
export function extractRolesFromClaims(payload: Record<string, any>): AppRole[] {
  const roles = new Set<AppRole>();

  const customRoles = payload["custom:roles"] ?? payload["custom:role"];
  if (Array.isArray(customRoles)) {
    for (const value of customRoles) {
      if (typeof value === "string" && isAppRole(value)) {
        roles.add(value);
      }
    }
  } else if (typeof customRoles === "string" && isAppRole(customRoles)) {
    roles.add(customRoles);
  }

  const groups = payload["cognito:groups"];
  if (Array.isArray(groups)) {
    for (const g of groups) {
      if (typeof g === "string" && isAppRole(g)) {
        roles.add(g);
      }
    }
  }

  // 최소 권한: 역할 정보가 전혀 없으면 빈 배열을 반환하여 보호 경로 접근을 막는다.
  return Array.from(roles);
}

function isAppRole(value: string): value is AppRole {
  return value === "fm-web:admin" || value === "fm-web:editor" || value === "fm-web:viewer";
}
