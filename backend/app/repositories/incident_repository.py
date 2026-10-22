from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentUpdate

class IncidentRepository:
    @staticmethod
    def create(db: Session, incident_in: IncidentCreate) -> Incident:
        incident = Incident(**incident_in.model_dump())
        db.add(incident)
        db.commit()
        db.refresh(incident)
        return incident

    @staticmethod
    def get_by_id(db: Session, incident_id: UUID, organization_id: UUID) -> Optional[Incident]:
        return db.scalar(
            select(Incident).where(
                Incident.id == incident_id,
                Incident.organization_id == organization_id
            )
        )

    @staticmethod
    def get_multi(
        db: Session,
        organization_id: UUID,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None
    ) -> List[Incident]:
        query = select(Incident).where(Incident.organization_id == organization_id)
        if status:
            query = query.where(Incident.status == status)
        query = query.order_by(Incident.created_at.desc()).offset(skip).limit(limit)
        return list(db.scalars(query).all())

    @staticmethod
    def update(db: Session, incident: Incident, update_data: dict) -> Incident:
        for field, value in update_data.items():
            setattr(incident, field, value)
        db.commit()
        db.refresh(incident)
        return incident
