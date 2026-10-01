from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.threat_event import ThreatEventListResponse
from app.services.threat_event_service import ThreatEventService

router = APIRouter(
    prefix="/threats",
    tags=["Threats"],
)

@router.get("", response_model=ThreatEventListResponse)
def list_threats(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    threats, total = ThreatEventService.list_recent(db, current_user.organization_id, limit)
    
    return ThreatEventListResponse(
        items=threats,
        total=total
    )
