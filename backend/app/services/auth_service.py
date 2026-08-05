from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.user import User
from app.models.user_role import UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
)
from app.security.hashing import (
    hash_password,
    verify_password,
)
from app.security.jwt import create_access_token


class AuthService:

    @staticmethod
    def register(
        db: Session,
        request: RegisterRequest,
    ) -> TokenResponse:

        # Check organization slug
        if UserRepository.get_organization_by_slug(
            db,
            request.organization_slug,
        ):
            raise ValueError("Organization slug already exists.")

        # Check email
        if UserRepository.get_user_by_email(
            db,
            request.email,
        ):
            raise ValueError("Email already exists.")

        # Check username
        if UserRepository.get_user_by_username(
            db,
            request.username,
        ):
            raise ValueError("Username already exists.")

        # Find Admin role
        admin_role = UserRepository.get_role_by_name(
            db,
            "Admin",
        )

        if admin_role is None:
            raise ValueError("Admin role not found.")

        # Create Organization
        organization = Organization(
            name=request.organization_name,
            slug=request.organization_slug,
            email=request.email,
        )

        UserRepository.create_organization(
            db,
            organization,
        )

        # Create User
        user = User(
            organization_id=organization.id,
            username=request.username,
            email=request.email,
            password_hash=hash_password(
                request.password,
            ),
            first_name=request.first_name,
            last_name=request.last_name,
        )

        UserRepository.create_user(
            db,
            user,
        )

        # Assign Admin role
        user_role = UserRole(
            user_id=user.id,
            role_id=admin_role.id,
        )

        UserRepository.assign_role(
            db,
            user_role,
        )

        # Commit everything together
        db.commit()

        # Generate JWT
        token = create_access_token(
            {
                "sub": user.email,
                "user_id": str(user.id),
            }
        )

        return TokenResponse(
            access_token=token,
        )

    @staticmethod
    def login(
        db: Session,
        request: LoginRequest,
    ) -> TokenResponse:

        # Find user by email
        user = UserRepository.authenticate_user(
            db,
            request.email,
        )

        if user is None:
            raise ValueError(
                "Invalid email or password."
            )

        # Verify password
        if not verify_password(
            request.password,
            user.password_hash,
        ):
            raise ValueError(
                "Invalid email or password."
            )

        # Generate JWT
        token = create_access_token(
            {
                "sub": user.email,
                "user_id": str(user.id),
            }
        )

        return TokenResponse(
            access_token=token,
        )