import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin


class AIPrediction(Base, TimestampMixin):
    __tablename__ = "ai_predictions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    device_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("devices.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    model_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    prediction: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    device = relationship(
        "Device",
        backref="ai_predictions",
    )
