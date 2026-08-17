from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.user_role import UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    UserCreateRequest,
    UserUpdateRequest,
)
from app.security.hashing import hash_password


class UserService:

    @staticmethod
    def list_users(
        db: Session,
        organization_id: UUID,
    ) -> list[User]:
        return UserRepository.get_users_by_organization(
            db,
            organization_id,
        )

    @staticmethod
    def create_user(
        db: Session,
        organization_id: UUID,
        request: UserCreateRequest,
    ) -> User:

        existing_email = (
            UserRepository.get_user_by_email_in_organization(
                db,
                request.email,
                organization_id,
            )
        )

        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            )

        existing_username = (
            UserRepository.get_user_by_username_in_organization(
                db,
                request.username,
                organization_id,
            )
        )

        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this username already exists.",
            )

        role = UserRepository.get_role_by_id(
            db,
            request.role_id,
        )

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found.",
            )

        user = User(
            organization_id=organization_id,
            username=request.username,
            email=request.email,
            password_hash=hash_password(request.password),
            first_name=request.first_name,
            last_name=request.last_name,
            is_active=True,
            email_verified=False,
        )

        try:
            UserRepository.create_user(db, user)

            UserRepository.assign_role(
                db,
                UserRole(
                    user_id=user.id,
                    role_id=role.id,
                ),
            )

            db.commit()
            db.refresh(user)

            return user

        except IntegrityError:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Unable to create user because the username or email already exists.",
            )

    @staticmethod
    def get_user(
        db: Session,
        organization_id: UUID,
        user_id: UUID,
    ) -> User:

        user = UserRepository.get_user_by_id_in_organization(
            db,
            user_id,
            organization_id,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return user

    @staticmethod
    def update_user(
        db: Session,
        organization_id: UUID,
        user_id: UUID,
        request: UserUpdateRequest,
    ) -> User:

        user = UserRepository.get_user_by_id_in_organization(
            db,
            user_id,
            organization_id,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        if request.email is not None:
            existing_email = (
                UserRepository.get_user_by_email_in_organization(
                    db,
                    request.email,
                    organization_id,
                )
            )

            if existing_email and existing_email.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A user with this email already exists.",
                )

            user.email = request.email

        if request.first_name is not None:
            user.first_name = request.first_name

        if request.last_name is not None:
            user.last_name = request.last_name

        if request.is_active is not None:
            user.is_active = request.is_active

        if request.role_id is not None:
            role = UserRepository.get_role_by_id(
                db,
                request.role_id,
            )

            if role is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Role not found.",
                )

            existing_role = UserRepository.get_user_role(
                db,
                user.id,
            )

            if existing_role is not None:
                existing_role.role_id = role.id
            else:
                UserRepository.assign_role(
                    db,
                    UserRole(
                        user_id=user.id,
                        role_id=role.id,
                    ),
                )

        try:
            UserRepository.update_user(db, user)

            db.commit()
            db.refresh(user)

            return user

        except IntegrityError:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Unable to update user because the email already exists.",
            )

    @staticmethod
    def delete_user(
        db: Session,
        organization_id: UUID,
        user_id: UUID,
        current_user_id: UUID,
    ) -> None:

        user = UserRepository.get_user_by_id_in_organization(
            db,
            user_id,
            organization_id,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        if user.id == current_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot delete your own account.",
            )

        db.delete(user)

        try:
            db.commit()

        except IntegrityError:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Unable to delete this user.",
            )