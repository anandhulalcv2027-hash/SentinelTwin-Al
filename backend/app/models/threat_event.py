import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, Float, JSON
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
    
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    source: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. "endpoint_agent", "network"
    detection_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. "ai_prediction", "anomaly_detection", "rule_based"
    threat_category: Mapped[str | None] = mapped_column(String(100), nullable=True) # e.g. "Malware", "Suspicious Process"

    severity: Mapped[str] = mapped_column(
        ENUM(ThreatSeverity, name="threat_severity_enum", create_type=False),
        nullable=False,
    )

    risk_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    # JSONB for storing flexible metadata
    classifier_info: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    anomaly_info: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    rule_info: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    evidence_context: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    status: Mapped[str] = mapped_column(String(50), nullable=False, default="open") # open, acknowledged, resolved

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    detected_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    device = relationship("Device", backref="threat_events")
    organization = relationship("Organization")
