from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse
from app.services.incident_service import IncidentService
from app.websocket.manager import websocket_manager

router = APIRouter()

@router.post("/", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(
    incident_in: IncidentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> IncidentResponse:
    # Ensure user has access to organization
    if incident_in.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create incidents outside of your organization"
        )
        
    incident = IncidentService.create_incident(db, incident_in)
    
    # Broadcast incident created
    incident_payload = IncidentResponse.model_validate(incident).model_dump(mode="json")
    background_tasks.add_task(
        websocket_manager.broadcast_to_organization,
        incident.organization_id,
        {
            "type": "incident.created",
            "incident": incident_payload,
        },
    )
    
    return incident

@router.get("/", response_model=List[IncidentResponse])
def read_incidents(
    skip: int = 0,
    limit: int = 100,
    incident_status: Optional[str] = Query(None, description="Filter by status (e.g., OPEN, RESOLVED)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[IncidentResponse]:
    return IncidentService.get_organization_incidents(
        db,
        organization_id=current_user.organization_id,
        skip=skip,
        limit=limit,
        status=incident_status
    )

@router.get("/{incident_id}", response_model=IncidentResponse)
def read_incident(
    incident_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> IncidentResponse:
    incident = IncidentService.get_incident(
        db,
        incident_id,
        current_user.organization_id
    )
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )
    return incident

@router.put("/{incident_id}", response_model=IncidentResponse)
def update_incident(
    incident_id: UUID,
    incident_in: IncidentUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> IncidentResponse:
    incident = IncidentService.update_incident(
        db,
        incident_id,
        current_user.organization_id,
        incident_in
    )
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )
        
    # Broadcast incident updated
    incident_payload = IncidentResponse.model_validate(incident).model_dump(mode="json")
    background_tasks.add_task(
        websocket_manager.broadcast_to_organization,
        incident.organization_id,
        {
            "type": "incident.updated",
            "incident": incident_payload,
        },
    )
        
    return incident
