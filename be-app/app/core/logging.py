from __future__ import annotations

import json
import logging
import time
import uuid
from typing import Any, Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


def setup_logging(level: int = logging.INFO) -> None:
    logger = logging.getLogger()
    if any(isinstance(h, logging.StreamHandler) for h in logger.handlers):
        # Assume already configured by caller
        return
    handler = logging.StreamHandler()
    handler.setFormatter(_JsonFormatter())
    logger.addHandler(handler)
    logger.setLevel(level)


class _JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:  # type: ignore[override]
        payload = {
            "ts": int(record.created * 1000),
            "level": record.levelname.lower(),
            "logger": record.name,
            "msg": record.getMessage(),
        }
        # Merge extra dict if present
        for key in ("request_id", "path", "method", "status_code", "duration_ms"):
            if hasattr(record, key):
                payload[key] = getattr(record, key)
        return json.dumps(payload, ensure_ascii=False)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable[[Request], Any]) -> Response:  # type: ignore[override]
        start = time.perf_counter()
        rid = request.headers.get("X-Request-Id") or getattr(request.state, "request_id", "") or str(uuid.uuid4())
        request.state.request_id = rid
        logger = logging.getLogger("app.request")
        logger.info(
            "request",
            extra={"request_id": rid, "path": request.url.path, "method": request.method},
        )
        response = await call_next(request)
        dur_ms = int((time.perf_counter() - start) * 1000)
        logger.info(
            "response",
            extra={
                "request_id": rid,
                "path": request.url.path,
                "method": request.method,
                "status_code": response.status_code,
                "duration_ms": dur_ms,
            },
        )
        response.headers.setdefault("X-Request-Id", rid)
        return response

