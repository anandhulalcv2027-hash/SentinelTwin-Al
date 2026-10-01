import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import HeartbeatStatus


class DeviceHeartbeat(Base):
    __tablename__ = "device_heartbeats"

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

    status: Mapped[str] = mapped_column(
        ENUM(HeartbeatStatus, name="heartbeat_status_enum", create_type=False),
        nullable=False,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    device = relationship(
        "Device",
        backref="heartbeats",
    )
