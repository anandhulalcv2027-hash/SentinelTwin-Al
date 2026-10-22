from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.ai_prediction import AIPrediction


class AIPredictionRepository:

    @staticmethod
    def create(
        db: Session,
        prediction: AIPrediction,
    ) -> AIPrediction:
        db.add(prediction)
        db.flush()
        return prediction

    @staticmethod
    def get_latest_by_device(
        db: Session,
        device_id: UUID,
    ) -> AIPrediction | None:
        stmt = (
            select(AIPrediction)
            .where(AIPrediction.device_id == device_id)
            .order_by(AIPrediction.created_at.desc())
            .limit(1)
        )
        return db.scalar(stmt)

    @staticmethod
    def list_by_device(
        db: Session,
        device_id: UUID,
        limit: int = 100,
    ) -> list[AIPrediction]:
        stmt = (
            select(AIPrediction)
            .where(AIPrediction.device_id == device_id)
            .order_by(AIPrediction.created_at.desc())
            .limit(limit)
        )
        return list(db.scalars(stmt).all())
