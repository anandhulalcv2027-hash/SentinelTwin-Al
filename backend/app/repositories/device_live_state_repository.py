from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.device_live_state import DeviceLiveState


class DeviceLiveStateRepository:

    @staticmethod
    def get_by_device_id(
        db: Session,
        device_id: UUID,
    ) -> DeviceLiveState | None:
        return db.scalar(
            select(DeviceLiveState).where(
                DeviceLiveState.device_id == device_id,
            )
        )

    @staticmethod
    def create(
        db: Session,
        state: DeviceLiveState,
    ) -> DeviceLiveState:
        db.add(state)
        db.flush()
        return state

    @staticmethod
    def update(
        db: Session,
        state: DeviceLiveState,
    ) -> DeviceLiveState:
        db.add(state)
        db.flush()
        return state
