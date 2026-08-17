from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.alert import AlertListResponse
from app.services.alert_service import AlertService


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"],
)


@router.get(
    "",
    response_model=AlertListResponse,
)
def list_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    alerts, total = AlertService.list_alerts(
        db,
        current_user.organization_id,
    )

    return AlertListResponse(
        items=alerts,
        total=total,
    )