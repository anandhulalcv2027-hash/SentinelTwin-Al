from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.device_telemetry import DeviceTelemetry


class DeviceTelemetryRepository:

    @staticmethod
    def create(
        db: Session,
        telemetry: DeviceTelemetry,
    ) -> DeviceTelemetry:
        db.add(telemetry)
        db.flush()
        return telemetry

    @staticmethod
    def get_latest_by_device(
        db: Session,
        device_id: UUID,
    ) -> DeviceTelemetry | None:
        return db.scalar(
            select(DeviceTelemetry)
            .where(
                DeviceTelemetry.device_id == device_id,
            )
            .order_by(
                DeviceTelemetry.collected_at.desc()
            )
            .limit(1)
        )

    @staticmethod
    def list_by_device(
        db: Session,
        device_id: UUID,
        limit: int = 100,
    ) -> list[DeviceTelemetry]:
        return list(
            db.scalars(
                select(DeviceTelemetry)
                .where(
                    DeviceTelemetry.device_id == device_id,
                )
                .order_by(
                    DeviceTelemetry.collected_at.desc()
                )
                .limit(limit)
            ).all()
        )