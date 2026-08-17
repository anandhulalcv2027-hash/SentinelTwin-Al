from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.alert import Alert


class AlertRepository:

    @staticmethod
    def list_by_organization(
        db: Session,
        organization_id: UUID,
    ) -> tuple[list[Alert], int]:
        total = db.scalar(
            select(func.count())
            .select_from(Alert)
            .where(
                Alert.organization_id == organization_id,
            )
        ) or 0

        alerts = list(
            db.scalars(
                select(Alert)
                .where(
                    Alert.organization_id == organization_id,
                )
                .order_by(
                    Alert.created_at.desc(),
                )
            ).all()
        )

        return alerts, total

    @staticmethod
    def get_by_id(
        db: Session,
        organization_id: UUID,
        alert_id: UUID,
    ) -> Alert | None:
        return db.scalar(
            select(Alert)
            .where(
                Alert.id == alert_id,
                Alert.organization_id == organization_id,
            )
        )