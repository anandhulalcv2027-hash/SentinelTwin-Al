import uuid
from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin
from app.models.enums import HealthStatus, RiskLevel


class DigitalTwin(Base, TimestampMixin):
    __tablename__ = "digital_twins"

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

    health_status: Mapped[str] = mapped_column(
        ENUM(HealthStatus, name="health_status_enum", create_type=False),
        nullable=False,
        default=HealthStatus.UNKNOWN,
    )

    risk_level: Mapped[str] = mapped_column(
        ENUM(RiskLevel, name="risk_level_enum", create_type=False),
        nullable=False,
        default=RiskLevel.LOW,
    )

    device = relationship(
        "Device",
        backref="digital_twin",
        uselist=False,
    )
