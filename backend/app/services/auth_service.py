from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.audit_log import AuditLog
from app.models.organization import Organization
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.models.user_role import UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.security.hashing import hash_password, verify_password
from app.security.jwt import (
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
)


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
                expires_at=datetime.utcnow()
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
        UserRepository.create_organization(db, organization)

        user = User(
            organization_id=organization.id,
            username=request.username,
            email=request.email,
            password_hash=hash_password(request.password),
            first_name=request.first_name,
            last_name=request.last_name,
        )
        UserRepository.create_user(db, user)

        UserRepository.assign_role(
            db,
            UserRole(
                user_id=user.id,
                role_id=admin_role.id,
            ),
        )

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

        user.last_login = datetime.utcnow()
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
            or stored_token.expires_at <= datetime.utcnow()
        ):
            raise ValueError("Invalid refresh token.")

        user = UserRepository.get_user_by_id(
            db,
            str(stored_token.user_id),
        )

        if user is None or not user.is_active:
            raise ValueError("Invalid refresh token.")

        stored_token.revoked_at = datetime.utcnow()
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
            if stored_token is not None and stored_token.user_id == user.id:
                stored_token.revoked_at = datetime.utcnow()

        AuthService._audit(
            db,
            "auth.logout",
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        db.commit()
