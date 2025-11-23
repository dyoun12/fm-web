from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from botocore.exceptions import BotoCoreError, ClientError

from .clients import get_boto3_client
from ..core import config


logger = logging.getLogger(__name__)


def _get_ses_client():
    return get_boto3_client("ses", region_name=config.SES_REGION)


def send_email(
    *,
    to_addresses: List[str],
    subject: str,
    body_text: str,
    body_html: Optional[str] = None,
    reply_to_addresses: Optional[List[str]] = None,
) -> Dict[str, Any] | None:
    """SES를 이용해 단순 텍스트/HTML 메일을 발송한다.

    설정 조건:
      - config.SES_SOURCE_EMAIL 이 설정되어 있어야 함
      - CONTACT_NOTIFICATION_ENABLED 가 True 여야 함
    """
    if not config.CONTACT_NOTIFICATION_ENABLED:
        logger.info("CONTACT_NOTIFICATION_ENABLED=0, 이메일 발송을 건너뜁니다.")
        return None

    if not config.SES_SOURCE_EMAIL:
        logger.warning("SES_SOURCE_EMAIL 이 설정되지 않아 이메일을 발송할 수 없습니다.")
        return None

    if not to_addresses:
        logger.warning("to_addresses 가 비어 있어 이메일을 발송할 수 없습니다.")
        return None

    try:
        client = _get_ses_client()

        body: Dict[str, Any] = {
            "Text": {"Data": body_text, "Charset": "UTF-8"},
        }
        if body_html:
            body["Html"] = {"Data": body_html, "Charset": "UTF-8"}

        params: Dict[str, Any] = {
            "Source": config.SES_SOURCE_EMAIL,
            "Destination": {"ToAddresses": to_addresses},
            "Message": {
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": body,
            },
        }

        reply_to = reply_to_addresses or ([] if not config.SES_REPLY_TO_EMAIL else [config.SES_REPLY_TO_EMAIL])
        if reply_to:
            params["ReplyToAddresses"] = reply_to

        response = client.send_email(**params)
        logger.info("SES 이메일 발송 성공: %s", response.get("MessageId"))
        return response
    except (ClientError, BotoCoreError) as e:
        logger.exception("SES 이메일 발송 실패: %s", e)
        return None

