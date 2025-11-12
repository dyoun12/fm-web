from __future__ import annotations

import os


def env(key: str, default: str | None = None) -> str | None:
    return os.getenv(key, default)


# DynamoDB Tables
POSTS_TABLE = env("POSTS_TABLE", "posts")
CATEGORIES_TABLE = env("CATEGORIES_TABLE", "categories")

# S3 Uploads
UPLOADS_BUCKET = env("UPLOADS_BUCKET", "example-uploads-bucket")
UPLOADS_PREFIX = env("UPLOADS_PREFIX", "uploads/")
MAX_UPLOAD_SIZE_MB = int(env("MAX_UPLOAD_SIZE_MB", "10") or 10)
ALLOWED_UPLOAD_MIME = set((env("ALLOWED_UPLOAD_MIME", "image/jpeg,image/png,application/pdf,application/zip") or "").split(","))

# CORS
CORS_ALLOW_ORIGINS = (env("CORS_ALLOW_ORIGINS", "http://localhost:3000").split(","))

# Backend mode
USE_DYNAMO = env("USE_DYNAMO", "0") == "1"
