from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.device import Device


class DeviceRepository:

    @staticmethod
    def create(
        db: Session,
        device: Device,
    ) -> Device:
        db.add(device)
        db.flush()
        return device

    @staticmethod
    def get_by_id(
        db: Session,
        device_id: UUID,
        organization_id: UUID,
    ) -> Device | None:
        return db.scalar(
            select(Device).where(
                Device.id == device_id,
                Device.organization_id == organization_id,
            )
        )

    @staticmethod
    def get_by_id_without_organization(
        db: Session,
        device_id: UUID,
    ) -> Device | None:
        return db.scalar(
            select(Device).where(
                Device.id == device_id,
            )
        )

    @staticmethod
    def get_by_identifier(
        db: Session,
        device_identifier: str,
    ) -> Device | None:
        return db.scalar(
            select(Device).where(
                Device.device_identifier == device_identifier,
            )
        )

    @staticmethod
    def list_by_organization(
        db: Session,
        organization_id: UUID,
    ) -> list[Device]:
        return list(
            db.scalars(
                select(Device)
                .where(
                    Device.organization_id == organization_id,
                )
                .order_by(Device.created_at.desc())
            ).all()
        )

    @staticmethod
    def count_by_organization(
        db: Session,
        organization_id: UUID,
    ) -> int:
        return (
            db.scalar(
                select(func.count(Device.id)).where(
                    Device.organization_id == organization_id,
                )
            )
            or 0
        )

    @staticmethod
    def update(
        db: Session,
        device: Device,
    ) -> Device:
        db.flush()
        return device

    @staticmethod
    def delete(
        db: Session,
        device: Device,
    ) -> None:
        db.delete(device)
        db.flush()