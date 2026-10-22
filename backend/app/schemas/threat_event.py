from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from typing import Any
from app.models.enums import ThreatSeverity

class ThreatEventResponse(BaseModel):
    id: UUID
    device_id: UUID
    organization_id: UUID
    source: str
    detection_type: str
    threat_category: str | None = None
    severity: ThreatSeverity
    risk_score: float
    status: str
    classifier_info: dict[str, Any] | None = None
    anomaly_info: dict[str, Any] | None = None
    rule_info: dict[str, Any] | None = None
    evidence_context: dict[str, Any] | None = None
    description: str | None = None
    detected_at: datetime
    
    device_name: str | None = None

    model_config = ConfigDict(from_attributes=True)

class ThreatEventListResponse(BaseModel):
    items: list[ThreatEventResponse]
    total: int
