from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.reporting_service import ReportingService

router = APIRouter()

@router.get("/threats/csv", response_class=PlainTextResponse)
def get_threats_csv(
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    csv_data = ReportingService.generate_threat_csv(
        db, 
        current_user.organization_id, 
        start_time, 
        end_time
    )
    return csv_data

@router.get("/summary/json")
def get_executive_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ReportingService.generate_executive_summary_json(db, current_user.organization_id)
