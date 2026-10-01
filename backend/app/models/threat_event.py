import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import ThreatSeverity


class ThreatEvent(Base):
    __tablename__ = "threat_events"

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

    threat_type: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    severity: Mapped[str] = mapped_column(
        ENUM(ThreatSeverity, name="threat_severity_enum", create_type=False),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    detected_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    device = relationship(
        "Device",
        backref="threat_events",
    )
