from __future__ import annotations

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .core import config
from .core.errors import http_exception_handler, unhandled_exception_handler
from .core.logging import setup_logging, RequestLoggingMiddleware
from .api.routers import posts as posts_router
from .api.routers import categories as categories_router
from .api.routers import upload as upload_router
from .api.routers import corp_meta as corp_meta_router
from .api.routers import auth as auth_router
from .api.routers import contact as contact_router


def create_app() -> FastAPI:
    base_path = os.getenv("API_BASE_PATH", "")
    setup_logging()
    app = FastAPI(title="FM-web Backend", version="0.1.0", root_path=base_path)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.CORS_ALLOW_ORIGINS,
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

    # Logging & Exception handlers
    app.add_middleware(RequestLoggingMiddleware)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    # Health
    @app.get("/health")
    def health():
        return {"status": "ok"}

    # Routers
    app.include_router(posts_router.router, prefix="/v1")
    app.include_router(categories_router.router, prefix="/v1")
    app.include_router(upload_router.router, prefix="/v1")
    app.include_router(corp_meta_router.router, prefix="/v1")
    app.include_router(contact_router.router, prefix="/v1")
    app.include_router(auth_router.router, prefix="/v1")

    return app


app = create_app()

# Define Lambda handler only when running in AWS Lambda/SAM
if os.getenv("AWS_LAMBDA_FUNCTION_NAME") or os.getenv("AWS_EXECUTION_ENV") or os.getenv("AWS_SAM_LOCAL"):
    from mangum import Mangum  # type: ignore
    base_path = os.getenv("API_BASE_PATH", "")
    kwargs = {}
    if base_path:
        kwargs["api_gateway_base_path"] = base_path
    handler = Mangum(app, **kwargs)
