from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.device import Device
from app.models.device_enrollment_token import DeviceEnrollmentToken
from app.security.device_heartbeat import (
    generate_heartbeat_token,
    hash_heartbeat_token,
)
from app.security.device_enrollment import hash_enrollment_token


class DeviceEnrollmentService:

    @staticmethod
    def enroll(
        db: Session,
        enrollment_token: str,
    ) -> tuple[Device, str]:

        token_hash = hash_enrollment_token(enrollment_token)

        enrollment = db.scalar(
            select(DeviceEnrollmentToken)
            .where(
                DeviceEnrollmentToken.token_hash == token_hash,
            )
        )

        if enrollment is None:
            raise ValueError("Invalid enrollment token.")

        now = datetime.utcnow()

        if enrollment.used_at is not None:
            raise ValueError("Enrollment token has already been used.")

        if enrollment.expires_at <= now:
            raise ValueError("Enrollment token has expired.")

        device = db.scalar(
            select(Device)
            .where(Device.id == enrollment.device_id)
        )

        if device is None:
            raise ValueError("Device not found.")

        if not device.is_active:
            raise PermissionError("Device is inactive.")

        # Generate a fresh permanent heartbeat credential.
        heartbeat_token = generate_heartbeat_token()
        device.heartbeat_token_hash = hash_heartbeat_token(
            heartbeat_token
        )

        # Consume the enrollment token so it cannot be reused.
        enrollment.used_at = now

        db.add(device)
        db.add(enrollment)

        db.commit()
        db.refresh(device)

        return device, heartbeat_token