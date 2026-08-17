from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    LogoutRequest,
    RefreshTokenRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    VerifyEmailRequest,
    GoogleSignInRequest,
)

from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=TokenResponse,
)
def register(
    http_request: Request,
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        return AuthService.register(
            db=db,
            request=request,
            ip_address=(
                http_request.client.host
                if http_request.client
                else None
            ),
            user_agent=http_request.headers.get("user-agent"),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    http_request: Request,
    db: Session = Depends(get_db),
):
    try:
        content_type = http_request.headers.get(
            "content-type",
            "",
        )

        if "application/json" in content_type:
            payload = await http_request.json()

            request = LoginRequest(
                **payload
            )

        else:
            form_data = await http_request.form()

            request = LoginRequest(
                email=(
                    form_data.get("username")
                    or form_data.get("email")
                ),
                password=form_data.get("password"),
            )

        return AuthService.login(
            db,
            request,
            ip_address=(
                http_request.client.host
                if http_request.client
                else None
            ),
            user_agent=http_request.headers.get(
                "user-agent"
            ),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.post(
    "/google",
    response_model=TokenResponse,
)
def google_login(
    http_request: Request,
    request: GoogleSignInRequest,
    db: Session = Depends(get_db),
):
    try:
        return AuthService.google_login(
            db=db,
            credential=request.credential,
            ip_address=(
                http_request.client.host
                if http_request.client
                else None
            ),
            user_agent=http_request.headers.get("user-agent"),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh(
    http_request: Request,
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    try:
        return AuthService.refresh(
            db,
            request.refresh_token,
            ip_address=(
                http_request.client.host
                if http_request.client
                else None
            ),
            user_agent=http_request.headers.get(
                "user-agent"
            ),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout(
    http_request: Request,
    request: LogoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    AuthService.logout(
        db,
        request.refresh_token,
        current_user,
        ip_address=(
            http_request.client.host
            if http_request.client
            else None
        ),
        user_agent=http_request.headers.get(
            "user-agent"
        ),
    )

    return None


@router.get(
    "/me",
    response_model=UserResponse,
)
def me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    return AuthService.forgot_password(
        db,
        request,
    )


@router.post("/verify-email")
def verify_email(
    request: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    try:
        return AuthService.verify_email(
            db,
            request,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    try:
        return AuthService.reset_password(
            db,
            request,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return AuthService.change_password(
            db,
            current_user,
            request,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )