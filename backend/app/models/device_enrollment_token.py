import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin


class DeviceEnrollmentToken(Base, TimestampMixin):
    __tablename__ = "device_enrollment_tokens"

    __table_args__ = (
        Index(
            "idx_device_enrollment_tokens_device",
            "device_id",
        ),
        Index(
            "idx_device_enrollment_tokens_expires",
            "expires_at",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    device_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("devices.id", ondelete="CASCADE"),
        nullable=False,
    )

    token_hash: Mapped[str] = mapped_column(
        String(128),
        unique=True,
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    used_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    device = relationship(
        "Device",
        back_populates="enrollment_tokens",
    )