import uuid
from datetime import datetime

from sqlalchemy import Float, ForeignKey, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin
from app.models.enums import NetworkStatus


class DeviceLiveState(Base, TimestampMixin):
    __tablename__ = "device_live_state"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    device_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("devices.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    cpu_usage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    memory_usage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    disk_usage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    network_status: Mapped[str] = mapped_column(
        ENUM(NetworkStatus, name="network_status_enum", create_type=False),
        nullable=False,
        default=NetworkStatus.DISCONNECTED,
    )

    process_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    last_seen: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    device = relationship(
        "Device",
        backref="live_state",
        uselist=False,
    )
