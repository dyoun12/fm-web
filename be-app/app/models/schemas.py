from __future__ import annotations

from datetime import datetime
from typing import Optional

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
