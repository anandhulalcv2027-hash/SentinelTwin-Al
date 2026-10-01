from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.models.threat_event import ThreatEvent
from app.models.device import Device
from app.schemas.threat_event import ThreatEventResponse

class ThreatEventService:
    @staticmethod
    def list_recent(db: Session, organization_id: UUID, limit: int = 10) -> tuple[list[ThreatEventResponse], int]:
        stmt = (
            select(ThreatEvent, Device)
            .join(Device, ThreatEvent.device_id == Device.id)
            .where(Device.organization_id == organization_id)
            .order_by(desc(ThreatEvent.detected_at))
            .limit(limit)
        )
        
        results = db.execute(stmt).all()
        
        responses = []
        for threat, device in results:
            resp = ThreatEventResponse.model_validate(threat)
            resp.device_name = device.name
            responses.append(resp)
            
        return responses, len(responses)
