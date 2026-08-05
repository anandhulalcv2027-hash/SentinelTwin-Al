import uuid

from sqlalchemy import Enum, ForeignKey, Index, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin
from app.models.enums import EmployeeStatus


class Employee(Base, TimestampMixin):
    __tablename__ = "employees"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "employee_id",
            name="uq_employee_org_employeeid",
        ),
        UniqueConstraint(
            "organization_id",
            "email",
            name="uq_employee_org_email",
        ),
        Index(
            "idx_employee_organization",
            "organization_id",
        ),
        Index(
            "idx_employee_department",
            "department",
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

    employee_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    department: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    designation: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    status: Mapped[EmployeeStatus] = mapped_column(
        Enum(
            EmployeeStatus,
            name="employee_status",
        ),
        default=EmployeeStatus.ACTIVE,
        nullable=False,
    )

    organization = relationship(
        "Organization",
        back_populates="employees",
    )