from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    organization_name: str = Field(max_length=255)
    organization_slug: str = Field(max_length=100)

    username: str = Field(max_length=100)

    email: EmailStr

    password: str = Field(min_length=8)

    first_name: str = Field(max_length=100)

    last_name: str = Field(max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr

    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str

    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=32)


class LogoutRequest(BaseModel):
    refresh_token: str | None = Field(default=None, min_length=32)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=32)
    new_password: str = Field(min_length=8)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str

    username: str

    email: EmailStr

    first_name: str

    last_name: str

    is_active: bool

