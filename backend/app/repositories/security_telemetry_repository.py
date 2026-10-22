from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.security_telemetry import SecurityTelemetry


class SecurityTelemetryRepository:

    @staticmethod
    def create(
        db: Session,
        telemetry: SecurityTelemetry,
    ) -> SecurityTelemetry:
        db.add(telemetry)
        return telemetry

    @staticmethod
    def get_latest_by_device(
        db: Session,
        device_id: UUID,
    ) -> SecurityTelemetry | None:
        stmt = (
            select(SecurityTelemetry)
            .where(SecurityTelemetry.device_id == device_id)
            .order_by(SecurityTelemetry.collected_at.desc())
            .limit(1)
        )
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def get_by_device(
        db: Session,
        device_id: UUID,
        limit: int = 100,
    ) -> List[SecurityTelemetry]:
        stmt = (
            select(SecurityTelemetry)
            .where(SecurityTelemetry.device_id == device_id)
            .order_by(SecurityTelemetry.collected_at.desc())
            .limit(limit)
        )
        return list(db.execute(stmt).scalars().all())
