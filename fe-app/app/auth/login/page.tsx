import { redirect } from "next/navigation";

const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;
const cognitoScope = process.env.NEXT_PUBLIC_COGNITO_SCOPE || "email openid aws.cognito.signin.user.admin profile fm-auth/roles.read";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function CognitoLoginPage({ searchParams }: PageProps) {
  if (!cognitoDomain || !clientId || !redirectUri) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center gap-4 px-4">
        <h1 className="text-xl font-semibold">로그인 설정이 완료되지 않았습니다.</h1>
        <p className="text-sm text-gray-600">
          Cognito Hosted UI를 사용하려면 다음 환경 변수가 설정되어 있어야 합니다:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li>NEXT_PUBLIC_COGNITO_DOMAIN</li>
          <li>NEXT_PUBLIC_COGNITO_CLIENT_ID</li>
          <li>NEXT_PUBLIC_COGNITO_REDIRECT_URI</li>
        </ul>
      </main>
    );
  }

  const url = new URL(`https://${cognitoDomain}/login`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", cognitoScope);
  url.searchParams.set("redirect_uri", redirectUri);

  redirect(url.toString());
}
