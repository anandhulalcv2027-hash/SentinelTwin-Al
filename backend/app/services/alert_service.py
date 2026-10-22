from datetime import timezone
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID


from app.models.alert import Alert
from app.models.device import Device
from app.models.device_telemetry import DeviceTelemetry
from app.models.incident import Incident, IncidentStatus
from app.models.enums import ThreatSeverity


CPU_THRESHOLD = 90.0
MEMORY_THRESHOLD = 90.0
DISK_THRESHOLD = 90.0


class AlertService:

    @staticmethod
    def evaluate_telemetry(
        db: Session,
        device: Device,
        telemetry: DeviceTelemetry,
    ) -> None:
        AlertService._evaluate_metric(
            db=db,
            device=device,
            alert_type="high_cpu",
            title="High CPU Usage",
            metric_value=telemetry.cpu_usage_percent,
            threshold=CPU_THRESHOLD,
            collected_at=telemetry.collected_at,
        )

        

        AlertService._evaluate_metric(
            db=db,
            device=device,
            alert_type="high_memory",
            title="High Memory Usage",
            metric_value=telemetry.memory_usage_percent,
            threshold=MEMORY_THRESHOLD,
            collected_at=telemetry.collected_at,
        )

        AlertService._evaluate_metric(
            db=db,
            device=device,
            alert_type="high_disk",
            title="High Disk Usage",
            metric_value=telemetry.disk_usage_percent,
            threshold=DISK_THRESHOLD,
            collected_at=telemetry.collected_at,
        )

    @staticmethod
    def list_alerts(
        db: Session,
        organization_id: UUID,
    ) -> tuple[list[Alert], int]:
        from app.repositories.alert_repository import (
            AlertRepository,
        )

        return AlertRepository.list_by_organization(
            db,
            organization_id,
        )

    @staticmethod
    def resolve_alert(
        db: Session,
        organization_id: UUID,
        alert_id: UUID,
    ) -> Alert:
        from app.repositories.alert_repository import AlertRepository
        
        # We need a method to get alert by id, or we can just use db.scalar
        alert = db.scalar(
            select(Alert)
            .where(
                Alert.id == alert_id,
                Alert.organization_id == organization_id,
            )
        )

        if alert is None:
            raise ValueError("Alert not found.")
            
        if alert.status == "resolved":
            return alert
            
        alert.status = "resolved"
        alert.resolved_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    def _evaluate_metric(
        db: Session,
        device: Device,
        alert_type: str,
        title: str,
        metric_value: float,
        threshold: float,
        collected_at: datetime,
    ) -> None:
        existing_alert = db.scalar(
            select(Alert)
            .where(
                Alert.device_id == device.id,
                Alert.alert_type == alert_type,
                Alert.status == "open",
            )
            .limit(1)
        )

        if metric_value > threshold:
            if existing_alert is not None:
                return

            alert = Alert(
                organization_id=device.organization_id,
                device_id=device.id,
                alert_type=alert_type,
                severity="warning",
                title=title,
                message=(
                    f"{device.name} exceeded the configured "
                    f"{title.lower()} threshold."
                ),
                metric_value=metric_value,
                threshold_value=threshold,
                status="open",
            )

            db.add(alert)

            return

        # Metric returned to a normal level.
        if existing_alert is not None:
            existing_alert.status = "resolved"
            existing_alert.resolved_at = collected_at

    @staticmethod
    def process_threat_event(db: Session, threat_event) -> tuple[Alert | None, bool]:
        """
        Phase 10: Alert Engine
        Receives ThreatEvents and determines when user-facing alerts should be generated.
        Prevents uncontrolled duplicate alerts for the same threat category on the same device.
        Returns (Alert, is_newly_created).
        """
        alert_type = f"threat_{threat_event.threat_category.lower().replace(' ', '_')}" if threat_event.threat_category else "correlated_threat"
        
        existing_alert = db.scalar(
            select(Alert)
            .where(
                Alert.device_id == threat_event.device_id,
                Alert.alert_type == alert_type,
                Alert.status == "open",
            )
            .limit(1)
        )
        
        is_new = False
        if existing_alert is not None:
            alert = existing_alert
            if threat_event.risk_score > (existing_alert.metric_value or 0):
                existing_alert.metric_value = float(threat_event.risk_score)
                existing_alert.severity = threat_event.severity.value.lower()
                existing_alert.message = f"Escalated Risk Score: {threat_event.risk_score:.1f}. {threat_event.description}"
        else:
            alert = Alert(
                organization_id=threat_event.organization_id,
                device_id=threat_event.device_id,
                alert_type=alert_type,
                severity=threat_event.severity.value.lower(),
                title=f"Security Threat: {threat_event.threat_category or 'Correlated Indicators'}",
                message=f"Risk Score: {threat_event.risk_score:.1f}. {threat_event.description}",
                metric_value=float(threat_event.risk_score),
                status="open",
            )
            db.add(alert)
            db.flush()
            is_new = True

        # Automatically escalate High/Critical threats to Incidents for SOC triage
        if threat_event.severity in (ThreatSeverity.CRITICAL, ThreatSeverity.HIGH):
            existing_incident = db.scalar(
                select(Incident)
                .where(
                    Incident.device_id == threat_event.device_id,
                    Incident.title == alert.title,
                    Incident.status.in_(["OPEN", "ACKNOWLEDGED", "INVESTIGATING"]),
                )
                .limit(1)
            )
            if not existing_incident:
                incident = Incident(
                    organization_id=threat_event.organization_id,
                    device_id=threat_event.device_id,
                    source_alert_id=alert.id,
                    source_threat_event_id=threat_event.id,
                    title=alert.title,
                    description=alert.message,
                    severity=threat_event.severity.value,
                    status=IncidentStatus.OPEN.value,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                db.add(incident)

        return alert, is_new