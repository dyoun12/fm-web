from __future__ import annotations

import os
from typing import Optional

from botocore.config import Config


def get_botocore_config(
    *,
    max_attempts: Optional[int] = None,
    read_timeout: Optional[int] = None,
    connect_timeout: Optional[int] = None,
) -> Config:
    """Build a botocore Config with sensible defaults and env overrides.

    Env vars:
      - AWS_MAX_ATTEMPTS (default: 3)
      - AWS_READ_TIMEOUT (default: 5)
      - AWS_CONNECT_TIMEOUT (default: 3)
    """
    attempts = max_attempts if max_attempts is not None else int(os.getenv("AWS_MAX_ATTEMPTS", "3"))
    rt = read_timeout if read_timeout is not None else int(os.getenv("AWS_READ_TIMEOUT", "5"))
    ct = connect_timeout if connect_timeout is not None else int(os.getenv("AWS_CONNECT_TIMEOUT", "3"))

    return Config(
        retries={"max_attempts": attempts, "mode": "standard"},
        read_timeout=rt,
        connect_timeout=ct,
    )

