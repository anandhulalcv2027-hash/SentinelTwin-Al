from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel
from typing import Dict, Any

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.organization import Organization

router = APIRouter()

class SettingsUpdate(BaseModel):
    settings: Dict[str, Any]

@router.get("/")
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    org = db.scalar(select(Organization).where(Organization.id == current_user.organization_id))
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return {"settings": org.settings}

@router.put("/")
def update_settings(
    update_req: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only allow owners/admins in real implementation. Here we just assume current_user has access.
    org = db.scalar(select(Organization).where(Organization.id == current_user.organization_id))
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    org.settings = update_req.settings
    db.commit()
    db.refresh(org)
    
    return {"settings": org.settings, "message": "Settings updated successfully"}
