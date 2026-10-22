from datetime import timezone
from datetime import datetime, timedelta, timezone

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.audit_log import AuditLog
from app.models.organization import Organization
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.models.user_role import UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    VerifyEmailRequest,
)
from app.security.hashing import hash_password, verify_password
from app.security.jwt import (
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
)
from app.models.password_reset_token import PasswordResetToken
from app.security.password_reset import (
    generate_reset_token,
    hash_reset_token,
)
from app.models.email_verification_token import EmailVerificationToken
from app.security.email_verification import (
    generate_verification_token,
    hash_verification_token,
)
from app.services.email_service import EmailService


class AuthService:

    @staticmethod
    def _create_token_pair(
        db: Session,
        user: User,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> TokenResponse:
        role_names = UserRepository.get_user_role_names(
            db,
            str(user.id),
        )

        access_token = create_access_token(
            {
                "sub": user.email,
                "user_id": str(user.id),
                "organization_id": str(user.organization_id),
                "roles": role_names,
            }
        )

        refresh_token = create_refresh_token()

        UserRepository.create_refresh_token(
            db,
            RefreshToken(
                user_id=user.id,
                token_hash=hash_refresh_token(refresh_token),
                expires_at=datetime.now(timezone.utc)
                + timedelta(days=settings.refresh_token_expire_days),
                created_by_ip=ip_address,
                user_agent=user_agent,
            ),
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    @staticmethod
    def _audit(
        db: Session,
        action: str,
        user: User | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        details: dict | None = None,
    ) -> None:
        UserRepository.create_audit_log(
            db,
            AuditLog(
                organization_id=user.organization_id if user else None,
                actor_user_id=user.id if user else None,
                action=action,
                resource_type="auth",
                resource_id=str(user.id) if user else None,
                ip_address=ip_address,
                user_agent=user_agent,
                details=details,
            ),
        )

    @staticmethod
    def register(
        db: Session,
        request: RegisterRequest,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> TokenResponse:

        if UserRepository.get_organization_by_slug(
            db,
            request.organization_slug,
        ):
            raise ValueError("Organization slug already exists.")

        if UserRepository.get_user_by_email(
            db,
            request.email,
        ):
            raise ValueError("Email already exists.")

        if UserRepository.get_user_by_username(
            db,
            request.username,
        ):
            raise ValueError("Username already exists.")

        admin_role = UserRepository.get_role_by_name(
            db,
            "Organization Administrator",
        )

        if admin_role is None:
            admin_role = UserRepository.get_role_by_name(
                db,
                "Admin",
            )

        if admin_role is None:
            raise ValueError("Organization Administrator role not found.")

        organization = Organization(
            name=request.organization_name,
            slug=request.organization_slug,
            email=request.email,
        )

        UserRepository.create_organization(
            db,
            organization,
        )

        user = User(
            organization_id=organization.id,
            username=request.username,
            email=request.email,
            password_hash=hash_password(request.password),
            first_name=request.first_name,
            last_name=request.last_name,
            email_verified=False,
        )

        UserRepository.create_user(
            db,
            user,
        )

        UserRepository.assign_role(
            db,
            UserRole(
                user_id=user.id,
                role_id=admin_role.id,
            ),
        )

        # Create email verification token.
        raw_verification_token = generate_verification_token()

        verification_token = EmailVerificationToken(
            user_id=user.id,
            token_hash=hash_verification_token(
                raw_verification_token
            ),
            expires_at=(
                datetime.now(timezone.utc)
                + timedelta(minutes=30)
            ),
        )

        UserRepository.create_email_verification_token(
            db,
            verification_token,
        )

        # Send verification email when email verification is enabled.
        if settings.email_verification_required:
            verification_url = (
                f"{settings.frontend_url}/verify-email"
                f"?token={raw_verification_token}"
            )

            EmailService.send_verification_email(
                to=user.email,
                verification_url=verification_url,
            )
        else:
            # Development/demo mode: allow registration without
            # depending on an external email provider.
            user.email_verified = True

        token_response = AuthService._create_token_pair(
            db,
            user,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        AuthService._audit(
            db,
            "auth.register",
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        db.commit()

        return token_response

    @staticmethod
    def verify_email(
        db: Session,
        request: VerifyEmailRequest,
    ) -> str:

        token_hash = hash_verification_token(
            request.token
        )

        verification_token = (
            UserRepository.get_email_verification_token_by_hash(
                db,
                token_hash,
            )
        )

        if verification_token is None:
            raise ValueError(
                "Invalid or expired email verification token."
            )

        now = datetime.now(timezone.utc)

        if verification_token.used_at is not None:
            raise ValueError(
                "Invalid or expired email verification token."
            )

        if verification_token.expires_at <= now:
            raise ValueError(
                "Invalid or expired email verification token."
            )

        user = UserRepository.get_user_by_id(
            db,
            str(verification_token.user_id),
        )

        if user is None:
            raise ValueError(
                "Invalid or expired email verification token."
            )

        if not user.is_active:
            raise ValueError(
                "User account is inactive."
            )

        if user.email_verified:
            raise ValueError(
                "Email is already verified."
            )

        user.email_verified = True
        verification_token.used_at = now

        AuthService._audit(
            db,
            "auth.email_verified",
            user=user,
        )

        db.commit()

        return "Email verified successfully."

    @staticmethod
    def login(
        db: Session,
        request: LoginRequest,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> TokenResponse:

        user = UserRepository.authenticate_user(
            db,
            request.email,
        )

        if user is None:
            raise ValueError("Invalid email or password.")

        if not user.is_active:
            raise ValueError("User account is inactive.")

        if not verify_password(
            request.password,
            user.password_hash,
        ):
            raise ValueError("Invalid email or password.")

        user.last_login = datetime.now(timezone.utc)

        token_response = AuthService._create_token_pair(
            db,
            user,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        AuthService._audit(
            db,
            "auth.login",
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        db.commit()

        return token_response

    @staticmethod
    def google_login(
        db: Session,
        credential: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> TokenResponse:

        try:
            google_user = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.google_client_id,
            )
        except ValueError:
            raise ValueError("Invalid Google credential.")

        if google_user.get("iss") not in (
            "accounts.google.com",
            "https://accounts.google.com",
        ):
            raise ValueError("Invalid Google credential.")

        google_email = google_user.get("email")

        if not google_email:
            raise ValueError(
                "Google account does not provide an email address."
            )

        if not google_user.get("email_verified", False):
            raise ValueError(
                "Your Google email address is not verified."
            )

        # Google Sign-In is only for existing SentinelTwin accounts.
        user = UserRepository.get_user_by_email(
            db,
            google_email,
        )

        if user is None:
            raise ValueError(
                "No SentinelTwin account exists with this Google email. "
                "Please register first."
            )

        if not user.is_active:
            raise ValueError("User account is inactive.")

        if not user.email_verified:
            user.email_verified = True

        user.last_login = datetime.now(timezone.utc)

        token_response = AuthService._create_token_pair(
            db,
            user,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        AuthService._audit(
            db,
            "auth.google_login",
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
            details={
                "provider": "google",
            },
        )

        db.commit()

        return token_response

    @staticmethod
    def refresh(
        db: Session,
        refresh_token: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> TokenResponse:

        stored_token = UserRepository.get_refresh_token_by_hash(
            db,
            hash_refresh_token(refresh_token),
        )

        if (
            stored_token is None
            or stored_token.revoked_at is not None
            or stored_token.expires_at <= datetime.now(timezone.utc)
        ):
            raise ValueError("Invalid refresh token.")

        user = UserRepository.get_user_by_id(
            db,
            str(stored_token.user_id),
        )

        if user is None or not user.is_active:
            raise ValueError("Invalid refresh token.")

        stored_token.revoked_at = datetime.now(timezone.utc)

        token_response = AuthService._create_token_pair(
            db,
            user,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        AuthService._audit(
            db,
            "auth.refresh",
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        db.commit()

        return token_response

    @staticmethod
    def logout(
        db: Session,
        refresh_token: str | None,
        user: User,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> None:

        if refresh_token:
            stored_token = UserRepository.get_refresh_token_by_hash(
                db,
                hash_refresh_token(refresh_token),
            )

            if (
                stored_token is not None
                and stored_token.user_id == user.id
            ):
                stored_token.revoked_at = datetime.now(timezone.utc)

        AuthService._audit(
            db,
            "auth.logout",
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        db.commit()

    @staticmethod
    def forgot_password(
        db: Session,
        request: ForgotPasswordRequest,
    ) -> str:

        user = UserRepository.get_user_by_email(
            db,
            request.email,
        )

        # Do not reveal whether the email exists.
        if user is None:
            return (
                "If an account exists with this email, "
                "a password reset link has been sent."
            )

        raw_token = generate_reset_token()

        token_hash = hash_reset_token(
            raw_token
        )

        expires_at = (
            datetime.now(timezone.utc)
            + timedelta(minutes=30)
        )

        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        UserRepository.create_password_reset_token(
            db,
            reset_token,
        )

        reset_url = (
            f"{settings.frontend_url}/reset-password"
            f"?token={raw_token}"
        )

        EmailService.send_password_reset_email(
            to=user.email,
            reset_url=reset_url,
        )

        db.commit()

        return (
            "If an account exists with this email, "
            "a password reset link has been sent."
        )

    @staticmethod
    def reset_password(
        db: Session,
        request: ResetPasswordRequest,
    ) -> str:

        token_hash = hash_reset_token(
            request.token
        )

        reset_token = (
            UserRepository.get_password_reset_token_by_hash(
                db,
                token_hash,
            )
        )

        if reset_token is None:
            raise ValueError(
                "Invalid or expired password reset token."
            )

        now = datetime.now(timezone.utc)

        if reset_token.used_at is not None:
            raise ValueError(
                "Invalid or expired password reset token."
            )

        if reset_token.expires_at <= now:
            raise ValueError(
                "Invalid or expired password reset token."
            )

        user = UserRepository.get_user_by_id(
            db,
            str(reset_token.user_id),
        )

        if user is None:
            raise ValueError(
                "Invalid or expired password reset token."
            )

        if not user.is_active:
            raise ValueError(
                "User account is inactive."
            )

        user.password_hash = hash_password(
            request.new_password
        )

        reset_token.used_at = now

        UserRepository.revoke_all_refresh_tokens(
            db,
            user.id,
        )

        EmailService.send_password_changed_email(
            to=user.email,
        )

        db.commit()

        return "Password reset successfully."

    @staticmethod
    def change_password(
        db: Session,
        user: User,
        request: ChangePasswordRequest,
    ) -> str:

        if not verify_password(
            request.current_password,
            user.password_hash,
        ):
            raise ValueError(
                "Current password is incorrect."
            )

        if verify_password(
            request.new_password,
            user.password_hash,
        ):
            raise ValueError(
                "New password must be different from the current password."
            )

        user.password_hash = hash_password(
            request.new_password
        )

        UserRepository.revoke_all_refresh_tokens(
            db,
            user.id,
        )

        EmailService.send_password_changed_email(
            to=user.email,
        )

        db.commit()

        return "Password changed successfully."