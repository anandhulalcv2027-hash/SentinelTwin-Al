from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.device import Device
from app.models.device_telemetry import DeviceTelemetry
from app.repositories.device_repository import DeviceRepository
from app.repositories.device_telemetry_repository import (
    DeviceTelemetryRepository,
)
from app.schemas.device import DeviceTelemetryRequest
from app.security.device_heartbeat import verify_heartbeat_token
from app.services.alert_service import AlertService
from app.services.twin_service import TwinService
from app.services.ai_prediction_service import AIPredictionService
from app.models.threat_event import ThreatEvent


class DeviceTelemetryService:

    @staticmethod
    def create(
        db: Session,
        device_id: UUID,
        token: str,
        request: DeviceTelemetryRequest,
    ) -> tuple[DeviceTelemetry, ThreatEvent | None]:
        device = DeviceRepository.get_by_id_without_organization(
            db,
            device_id,
        )

        if device is None:
            raise ValueError("Device not found.")

        if not device.is_active:
            raise PermissionError("Device is inactive.")

        if device.heartbeat_token_hash is None:
            raise PermissionError(
                "Device telemetry is not configured."
            )

        if not verify_heartbeat_token(
            token,
            device.heartbeat_token_hash,
        ):
            raise PermissionError(
                "Invalid device heartbeat token."
            )

        telemetry = DeviceTelemetry(
            device_id=device.id,
            hostname=request.hostname,
            operating_system=request.operating_system,
            os_version=request.os_version,
            cpu_usage_percent=request.cpu_usage_percent,
            memory_usage_percent=request.memory_usage_percent,
            disk_usage_percent=request.disk_usage_percent,
            uptime_seconds=request.uptime_seconds,
            agent_version=request.agent_version,
            collected_at=datetime.utcnow(),
        )

        DeviceTelemetryRepository.create(
            db,
            telemetry,
        )

        # Telemetry also proves that the endpoint is alive.
        device.last_seen = datetime.utcnow()

        DeviceRepository.update(
            db,
            device,
        )

        AlertService.evaluate_telemetry(
            db,
            device,
            telemetry,
        )
        
        prediction, threat_event = AIPredictionService.evaluate_telemetry(
            db,
            device,
            telemetry,
        )
        
        TwinService.sync_from_telemetry(
            db,
            device.id,
            telemetry,
            prediction,
        )

        db.commit()
        db.refresh(telemetry)

        return telemetry, threat_event

    @staticmethod
    def get_organization_id(
        db: Session,
        device_id: UUID,
    ) -> UUID:
        device = DeviceRepository.get_by_id_without_organization(
            db,
            device_id,
        )

        if device is None:
            raise ValueError("Device not found.")

        return device.organization_id


    @staticmethod
    def get_latest(
        db: Session,
        device_id: UUID,
    ) -> DeviceTelemetry:
        device = DeviceRepository.get_by_id_without_organization(
            db,
            device_id,
        )

        if device is None:
            raise ValueError("Device not found.")

        telemetry = (
            DeviceTelemetryRepository.get_latest_by_device(
                db,
                device_id,
            )
        )

        if telemetry is None:
            raise ValueError(
                "Telemetry data is not available yet."
            )

        return telemetry
