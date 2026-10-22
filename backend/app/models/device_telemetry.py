import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class DeviceTelemetry(Base):
    __tablename__ = "device_telemetry"

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

    hostname: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    operating_system: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    os_version: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    cpu_usage_percent: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    memory_usage_percent: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    disk_usage_percent: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    uptime_seconds: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    network_bytes_sent: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    network_bytes_recv: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    active_connections: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    process_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    failed_logins: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    agent_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    collected_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    device = relationship(
        "Device",
    )