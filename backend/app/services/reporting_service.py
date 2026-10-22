from datetime import timezone
import csv
import io
import json
from datetime import datetime
from uuid import UUID
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from app.models.threat_event import ThreatEvent
from app.models.device import Device
from app.models.organization import Organization

class ReportingService:
    @staticmethod
    def generate_threat_csv(db: Session, organization_id: UUID, start_time: Optional[datetime] = None, end_time: Optional[datetime] = None) -> str:
        query = select(ThreatEvent).where(ThreatEvent.organization_id == organization_id)
        if start_time:
            query = query.where(ThreatEvent.detected_at >= start_time)
        if end_time:
            query = query.where(ThreatEvent.detected_at <= end_time)
            
        threats = db.scalars(query.order_by(desc(ThreatEvent.detected_at))).all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Detected At", "Device ID", "Threat Category", "Threat Type", "Severity", "Risk Score", "Status"])
        
        for t in threats:
            writer.writerow([str(t.id), t.detected_at.isoformat(), str(t.device_id), t.threat_category, t.threat_type, t.severity, t.risk_score, t.status])
            
        return output.getvalue()

    @staticmethod
    def generate_executive_summary_json(db: Session, organization_id: UUID) -> dict:
        # Get org info
        org = db.scalar(select(Organization).where(Organization.id == organization_id))
        
        # Threat stats
        total_threats = db.query(ThreatEvent).filter(ThreatEvent.organization_id == organization_id).count()
        critical_threats = db.query(ThreatEvent).filter(ThreatEvent.organization_id == organization_id, ThreatEvent.severity == "CRITICAL").count()
        
        # Device stats
        total_devices = db.query(Device).filter(Device.organization_id == organization_id).count()
        
        return {
            "organization_name": org.name if org else "Unknown",
            "report_generated_at": datetime.now(timezone.utc).isoformat(),
            "summary": {
                "total_monitored_devices": total_devices,
                "total_threats_detected": total_threats,
                "critical_threats": critical_threats
            },
            "recommendations": [
                "Review critical threats immediately.",
                "Ensure all active endpoints have updated agents."
            ]
        }
