from __future__ import annotations

import os


def env(key: str, default: str | None = None) -> str | None:
    return os.getenv(key, default)


# DynamoDB Tables
POSTS_TABLE = env("POSTS_TABLE", "posts")
CATEGORIES_TABLE = env("CATEGORIES_TABLE", "categories")
CORP_META_TABLE = env("CORP_META_TABLE", "corp_meta")

# S3 Uploads
UPLOADS_BUCKET = env("UPLOADS_BUCKET", "example-uploads-bucket")
UPLOADS_PREFIX = env("UPLOADS_PREFIX", "uploads/")
MAX_UPLOAD_SIZE_MB = int(env("MAX_UPLOAD_SIZE_MB", "10") or 10)
ALLOWED_UPLOAD_MIME = set((env("ALLOWED_UPLOAD_MIME", "image/jpeg,image/png,application/pdf,application/zip") or "").split(","))

# CORS
CORS_ALLOW_ORIGINS = (env("CORS_ALLOW_ORIGINS", "http://localhost:3000").split(","))

# Backend mode
USE_DYNAMO = env("USE_DYNAMO", "0") == "1"

# Cognito / Auth
COGNITO_REGION = env("COGNITO_REGION", os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION") or None)
COGNITO_USER_POOL_ID = env("COGNITO_USER_POOL_ID", None)
COGNITO_CLIENT_ID = env("COGNITO_CLIENT_ID", None)
COGNITO_JWKS_URL = env("COGNITO_JWKS_URL", None)
# API Gateway Cognito Authorizer에서 서명 검증을 수행하도록 신뢰할지 여부(기본: False)
COGNITO_TRUST_API_GATEWAY = env("COGNITO_TRUST_API_GATEWAY", "0") == "1"

# Cognito Hosted UI / OAuth2
COGNITO_DOMAIN = env("COGNITO_DOMAIN", None)
COGNITO_REDIRECT_URI = env("COGNITO_REDIRECT_URI", None)
COGNITO_LOGOUT_REDIRECT_URI = env("COGNITO_LOGOUT_REDIRECT_URI", None)
COGNITO_CLIENT_SECRET = env("COGNITO_CLIENT_SECRET", None)

# Auth cookies
AUTH_COOKIE_NAME = env("AUTH_COOKIE_NAME", "fm_auth_token")
AUTH_COOKIE_SECURE = env("AUTH_COOKIE_SECURE", "0") == "1"
AUTH_COOKIE_MAX_AGE_SECONDS = int(env("AUTH_COOKIE_MAX_AGE_SECONDS", "0") or 0)
AUTH_COOKIE_DOMAIN = env("AUTH_COOKIE_DOMAIN", None)
