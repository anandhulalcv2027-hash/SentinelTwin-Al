from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import (
    get_current_user,
    require_permission,
)
from app.models.user import User
from app.schemas.user import (
    UserCreateRequest,
    UserListResponse,
    UserResponse,
    UserUpdateRequest,
)
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


def build_user_response(
    db: Session,
    user: User,
) -> UserResponse:
    roles = UserRepository.get_user_role_names(
        db,
        str(user.id),
    )

    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        organization_id=user.organization_id,
        is_active=user.is_active,
        email_verified=user.email_verified,
        last_login=user.last_login,
        roles=roles,
    )


@router.get(
    "",
    response_model=UserListResponse,
)
def list_users(
    current_user: User = Depends(
        require_permission("user.read")
    ),
    db: Session = Depends(get_db),
):
    current_user_roles = UserRepository.get_user_role_names(
        db,
        str(current_user.id),
    )

    is_super_admin = "Super Admin" in current_user_roles

    users = UserService.list_users(
        db,
        current_user.organization_id,
        is_super_admin=is_super_admin,
    )

    return UserListResponse(
        items=[
            build_user_response(db, user)
            for user in users
        ],
        total=len(users),
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: UUID,
    current_user: User = Depends(
        require_permission("user.read")
    ),
    db: Session = Depends(get_db),
):
    user = UserService.get_user(
        db,
        current_user.organization_id,
        user_id,
    )

    return build_user_response(db, user)


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    request: UserCreateRequest,
    current_user: User = Depends(
        require_permission("user.create")
    ),
    db: Session = Depends(get_db),
):
    user = UserService.create_user(
        db,
        current_user.organization_id,
        request,
    )

    return build_user_response(db, user)


@router.patch(
    "/{user_id}",
    response_model=UserResponse,
)
def update_user(
    user_id: UUID,
    request: UserUpdateRequest,
    current_user: User = Depends(
        require_permission("user.update")
    ),
    db: Session = Depends(get_db),
):
    user = UserService.update_user(
        db,
        current_user.organization_id,
        user_id,
        request,
    )

    return build_user_response(db, user)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(
    user_id: UUID,
    current_user: User = Depends(
        require_permission("user.delete")
    ),
    db: Session = Depends(get_db),
):
    UserService.delete_user(
        db,
        current_user.organization_id,
        user_id,
        current_user.id,
    )

    return None