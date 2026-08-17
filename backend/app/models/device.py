import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin


class Device(Base, TimestampMixin):
    __tablename__ = "devices"

    __table_args__ = (
        Index(
            "idx_devices_organization",
            "organization_id",
        ),
        Index(
            "idx_devices_status",
            "organization_id",
            "is_active",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    device_identifier: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    device_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="endpoint",
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    last_seen: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    heartbeat_token_hash: Mapped[str | None] = mapped_column(
        String(128),
        unique=True,
        nullable=True,
    )

    organization = relationship(
        "Organization",
        back_populates="devices",
    )