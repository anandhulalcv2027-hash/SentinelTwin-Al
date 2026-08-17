from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import require_permission
from app.schemas.role import RoleListResponse
from app.services.role_service import RoleService


router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
)


@router.get(
    "",
    response_model=RoleListResponse,
)
def list_roles(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_permission("user.create")
    ),
):
    return RoleService.list_roles(db)