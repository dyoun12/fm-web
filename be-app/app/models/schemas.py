from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class PostBase(BaseModel):
    category: str = Field(..., description="카테고리 슬러그 또는 이름")
    title: str
    content: str
    thumbnailUrl: Optional[str] = None
    author: Optional[str] = None


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    thumbnailUrl: Optional[str] = None
    author: Optional[str] = None


class Post(PostBase):
    postId: str
    createdAt: datetime
    updatedAt: datetime


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    order: Optional[int] = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class Category(CategoryBase):
    categoryId: str


class CorpMetaBase(BaseModel):
    address: Optional[str] = None
    corpNum: Optional[str] = None
    ceo: Optional[str] = None
    email: Optional[str] = None
    hp: Optional[str] = None


class CorpMetaCreate(CorpMetaBase):
    pass


class CorpMetaUpdate(BaseModel):
    address: Optional[str] = None
    corpNum: Optional[str] = None
    ceo: Optional[str] = None
    email: Optional[str] = None
    hp: Optional[str] = None


class CorpMeta(CorpMetaBase):
    corpMetaId: str
    createdAt: datetime
    updatedAt: datetime


class ContactInquiryBase(BaseModel):
    company: str
    title: str
    name: str
    email: str
    referral: str
    subject: str
    message: str


class ContactInquiryCreate(ContactInquiryBase):
    pass


class ContactInquiry(ContactInquiryBase):
    inquiryId: str
    status: Optional[str] = Field(default=None, description="문의 처리 상태(new, in_progress, done 등)")
    notifiedEmail: Optional[str] = Field(
        default=None, description="알림 메일이 발송된 대상 주소(추적용, corpmeta.email 스냅샷)"
    )
    createdAt: datetime
    updatedAt: datetime


class ContactReplyCreate(BaseModel):
    message: str = Field(..., description="사용자에게 전송할 1차 답변 내용")


class ContactInquiryStatusUpdate(BaseModel):
    status: Literal["new", "in_progress", "done"] = Field(..., description="문의 처리 상태")
