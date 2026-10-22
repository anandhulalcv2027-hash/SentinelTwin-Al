from datetime import timezone
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from app.repositories.incident_repository import IncidentRepository
from app.schemas.incident import IncidentCreate, IncidentUpdate
from app.models.incident import Incident, IncidentStatus

class IncidentService:
    @staticmethod
    def create_incident(db: Session, incident_in: IncidentCreate) -> Incident:
        return IncidentRepository.create(db, incident_in)

    @staticmethod
    def get_incident(db: Session, incident_id: UUID, organization_id: UUID) -> Optional[Incident]:
        return IncidentRepository.get_by_id(db, incident_id, organization_id)

    @staticmethod
    def get_organization_incidents(
        db: Session,
        organization_id: UUID,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None
    ) -> List[Incident]:
        return IncidentRepository.get_multi(db, organization_id, skip=skip, limit=limit, status=status)

    @staticmethod
    def update_incident(
        db: Session,
        incident_id: UUID,
        organization_id: UUID,
        incident_in: IncidentUpdate
    ) -> Optional[Incident]:
        incident = IncidentRepository.get_by_id(db, incident_id, organization_id)
        if not incident:
            return None

        update_data = incident_in.model_dump(exclude_unset=True)
        
        # Handle state transitions automatically based on status change
        if "status" in update_data:
            new_status = update_data["status"]
            old_status = incident.status
            
            if new_status == IncidentStatus.ACKNOWLEDGED and old_status == IncidentStatus.OPEN:
                update_data["acknowledged_at"] = datetime.now(timezone.utc)
            elif new_status == IncidentStatus.RESOLVED and old_status != IncidentStatus.RESOLVED:
                update_data["resolved_at"] = datetime.now(timezone.utc)
                
        return IncidentRepository.update(db, incident, update_data)
