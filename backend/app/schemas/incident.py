from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, Any
from app.models.incident import IncidentStatus, IncidentSeverity

class IncidentBase(BaseModel):
    title: str = Field(..., description="Title of the incident")
    description: Optional[str] = Field(None, description="Detailed description")
    severity: IncidentSeverity = Field(..., description="Severity of the incident")
    status: IncidentStatus = Field(IncidentStatus.OPEN, description="Current status")
    assigned_user_id: Optional[UUID] = Field(None, description="ID of the user assigned to investigate")
    investigation_notes: Optional[list[dict[str, Any]]] = Field(None, description="Notes added during investigation")
    resolution_information: Optional[str] = Field(None, description="Details of how the incident was resolved")

class IncidentCreate(IncidentBase):
    organization_id: UUID
    device_id: UUID
    source_alert_id: Optional[UUID] = None
    source_threat_event_id: Optional[UUID] = None

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[IncidentSeverity] = None
    status: Optional[IncidentStatus] = None
    assigned_user_id: Optional[UUID] = None
    investigation_notes: Optional[list[dict[str, Any]]] = None
    resolution_information: Optional[str] = None

class IncidentResponse(IncidentBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    device_id: UUID
    source_alert_id: Optional[UUID] = None
    source_threat_event_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
