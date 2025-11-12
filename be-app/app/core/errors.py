from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse


def ok(data: Any) -> Dict[str, Any]:
    return {"success": True, "data": data, "error": None}


def err(code: str, message: str, *, details: Optional[Dict[str, Any]] = None, trace_id: Optional[str] = None) -> Dict[str, Any]:
    return {
        "success": False,
        "data": None,
        "error": {
            "code": code,
            "message": message,
            "details": details or {},
            "traceId": trace_id,
        },
    }


async def http_exception_handler(request: Request, exc: HTTPException):
    trace_id = getattr(request.state, "request_id", None)
    payload = err(
        code=f"HTTP_{exc.status_code}",
        message=str(exc.detail),
        details={"headers": dict(exc.headers or {})},
        trace_id=trace_id,
    )
    return JSONResponse(status_code=exc.status_code, content=payload)


async def unhandled_exception_handler(request: Request, exc: Exception):
    trace_id = getattr(request.state, "request_id", None)
    payload = err(code="INTERNAL_ERROR", message="Unexpected server error", details={}, trace_id=trace_id)
    return JSONResponse(status_code=500, content=payload)

