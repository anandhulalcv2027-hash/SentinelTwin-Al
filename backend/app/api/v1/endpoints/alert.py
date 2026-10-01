from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from uuid import UUID

from app.schemas.alert import AlertListResponse, AlertResponse
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

@router.post(
    "/{alert_id}/resolve",
    response_model=AlertResponse,
)
def resolve_alert(
    alert_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        from fastapi import HTTPException, status
        alert = AlertService.resolve_alert(
            db,
            current_user.organization_id,
            alert_id,
        )
        return alert
    except ValueError as e:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )