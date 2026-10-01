from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.models.enums import ThreatSeverity

class ThreatEventResponse(BaseModel):
    id: UUID
    device_id: UUID
    threat_type: str
    severity: ThreatSeverity
    description: str | None = None
    detected_at: datetime
    
    # We might want device name in the list, but let's keep it simple or add device_name
    device_name: str | None = None

    model_config = ConfigDict(from_attributes=True)

class ThreatEventListResponse(BaseModel):
    items: list[ThreatEventResponse]
    total: int
