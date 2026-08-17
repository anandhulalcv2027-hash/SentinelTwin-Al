from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID


from app.models.alert import Alert
from app.models.device import Device
from app.models.device_telemetry import DeviceTelemetry


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