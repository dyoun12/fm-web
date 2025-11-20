import type { JWTPayload } from "jose";
import { createRemoteJWKSet, jwtVerify } from "jose";

import { extractRolesFromClaims, type AppRole } from "./access-control";

const region =
  process.env.NEXT_PUBLIC_COGNITO_REGION ||
  process.env.NEXT_PUBLIC_AWS_REGION ||
  process.env.AWS_REGION;

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

if (!region || !userPoolId || !clientId) {
  // 런타임 환경에서 필수 환경 변수 누락 시 빠르게 원인을 파악하기 위해 경고를 남긴다.
  // (Amplify Hosting에서는 `amplify.yml`을 통해 이 값들을 주입해야 한다.)
  // eslint-disable-next-line no-console
  console.warn(
    "[auth] Cognito 환경 변수(NEXT_PUBLIC_COGNITO_REGION, NEXT_PUBLIC_COGNITO_USER_POOL_ID, NEXT_PUBLIC_COGNITO_CLIENT_ID)가 설정되지 않았습니다. 보호 경로 접근 제어가 정상 동작하지 않을 수 있습니다.",
  );
}

const issuerBase = region && userPoolId ? `https://cognito-idp.${region}.amazonaws.com/${userPoolId}` : undefined;

// JWKS 엔드포인트에서 공개키를 가져와 JWT 서명 검증에 사용한다.
const jwks =
  issuerBase != null
    ? createRemoteJWKSet(new URL(`${issuerBase}/.well-known/jwks.json`))
    : // 환경 변수가 없는 경우, 검증 시도 시 에러를 발생시키는 더미 함수
      (async () => {
        throw new Error("Cognito JWKS 구성이 완료되지 않았습니다.");
      });

export type DecodedToken = {
  payload: JWTPayload;
  roles: AppRole[];
};

export async function verifyCognitoToken(token: string): Promise<DecodedToken> {
  if (!issuerBase) {
    throw new Error("Cognito 환경 변수가 설정되지 않았습니다.");
  }

  // 1차로 issuer와 서명만 검증하고, audience는 payload를 본 뒤에 수동으로 검증한다.
  const { payload } = await jwtVerify(token, jwks, {
    issuer: issuerBase,
  });

  const claims = payload as Record<string, any>;

  // aud가 없는 access token에서도 오류가 나지 않도록,
  // aud 또는 client_id가 존재할 때만 clientId와 수동 비교한다.
  if (clientId) {
    const tokenAudience = (claims.aud ?? claims.client_id) as string | undefined;
    if (tokenAudience && tokenAudience !== clientId) {
      throw new Error("Invalid token audience");
    }
  }

  const roles = extractRolesFromClaims(claims);
  return { payload, roles };
}
