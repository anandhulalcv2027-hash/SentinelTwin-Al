from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.digital_twin import DigitalTwin


class DigitalTwinRepository:

    @staticmethod
    def get_by_device_id(
        db: Session,
        device_id: UUID,
    ) -> DigitalTwin | None:
        return db.scalar(
            select(DigitalTwin).where(
                DigitalTwin.device_id == device_id,
            )
        )

    @staticmethod
    def create(
        db: Session,
        twin: DigitalTwin,
    ) -> DigitalTwin:
        db.add(twin)
        db.flush()
        return twin

    @staticmethod
    def update(
        db: Session,
        twin: DigitalTwin,
    ) -> DigitalTwin:
        db.add(twin)
        db.flush()
        return twin
