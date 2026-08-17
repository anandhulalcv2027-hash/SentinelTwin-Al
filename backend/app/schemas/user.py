from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    organization_id: UUID
    is_active: bool
    email_verified: bool = False
    last_login: datetime | None = None
    roles: list[str] = []

    model_config = ConfigDict(
        from_attributes=True,
    )


class UserCreateRequest(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    email: EmailStr
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    role_id: UUID


class UserUpdateRequest(BaseModel):
    first_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    last_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    email: EmailStr | None = None
    is_active: bool | None = None
    role_id: UUID | None = None


class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int