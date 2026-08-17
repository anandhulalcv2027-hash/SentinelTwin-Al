from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.role import RoleListResponse


class RoleService:

    @staticmethod
    def list_roles(
        db: Session,
    ) -> RoleListResponse:
        roles = UserRepository.get_all_roles(db)

        return RoleListResponse(
            items=roles,
            total=len(roles),
        )