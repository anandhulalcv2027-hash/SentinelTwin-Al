from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AlertResponse(BaseModel):
    id: UUID
    organization_id: UUID
    device_id: UUID

    alert_type: str
    severity: str
    title: str
    message: str

    metric_value: float | None
    threshold_value: float | None

    status: str
    resolved_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class AlertListResponse(BaseModel):
    items: list[AlertResponse]
    total: int