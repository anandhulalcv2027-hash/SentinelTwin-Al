from datetime import timezone
from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.security_telemetry import SecurityTelemetry
from app.repositories.device_repository import DeviceRepository
from app.repositories.security_telemetry_repository import (
    SecurityTelemetryRepository,
)
from app.schemas.security_telemetry import SecurityTelemetryRequest
from app.security.device_heartbeat import verify_heartbeat_token
# We may need AlertService or AI Service here later, but keep it simple for now.


class SecurityTelemetryService:

    @staticmethod
    def create(
        db: Session,
        device_id: UUID,
        token: str,
        request: SecurityTelemetryRequest,
    ) -> SecurityTelemetry:
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

        # Convert Pydantic models to dicts before saving to JSONB
        telemetry = SecurityTelemetry(
            device_id=device.id,
            processes=[p.model_dump() for p in request.processes],
            network_connections=[c.model_dump() for c in request.network_connections],
            open_ports=[p.model_dump() for p in request.open_ports],
            authentication_events=[a.model_dump() for a in request.authentication_events],
            firewall_enabled=request.firewall_enabled,
            security_events=request.security_events,
            collected_at=datetime.now(timezone.utc),
        )

        SecurityTelemetryRepository.create(
            db,
            telemetry,
        )

        # Update last seen
        device.last_seen = datetime.now(timezone.utc)
        DeviceRepository.update(
            db,
            device,
        )

        # We will add AlertService and AI Prediction logic here later 
        # based on security telemetry when those parts are built.

        db.commit()
        db.refresh(telemetry)

        return telemetry

    @staticmethod
    def get_latest(
        db: Session,
        device_id: UUID,
    ) -> SecurityTelemetry:
        device = DeviceRepository.get_by_id_without_organization(
            db,
            device_id,
        )

        if device is None:
            raise ValueError("Device not found.")

        telemetry = (
            SecurityTelemetryRepository.get_latest_by_device(
                db,
                device_id,
            )
        )

        if telemetry is None:
            raise ValueError(
                "Security telemetry data is not available yet."
            )

        return telemetry
