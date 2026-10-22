import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SecurityTelemetry(Base):
    __tablename__ = "security_telemetry"

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

    processes: Mapped[list[dict]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    network_connections: Mapped[list[dict]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    open_ports: Mapped[list[dict]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    authentication_events: Mapped[list[dict]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    firewall_enabled: Mapped[bool] = mapped_column(
        Boolean,
        nullable=True,
    )

    security_events: Mapped[list[dict]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    collected_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    device = relationship(
        "Device",
    )
