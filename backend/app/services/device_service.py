from uuid import UUID

from sqlalchemy.orm import Session

from app.models.device import Device
from app.models.user import User
from app.repositories.device_repository import DeviceRepository
from app.schemas.device import (
    DeviceCreateRequest,
    DeviceUpdateRequest,
)
from app.security.device_heartbeat import (
    generate_heartbeat_token,
    hash_heartbeat_token,
    verify_heartbeat_token,
)
from datetime import datetime

class DeviceService:

    @staticmethod
    def create(
        db: Session,
        current_user: User,
        request: DeviceCreateRequest,
    ) -> tuple[Device, str]:
        existing = DeviceRepository.get_by_identifier(
            db,
            request.device_identifier,
        )

        if existing is not None:
            raise ValueError(
                "A device with this identifier already exists."
            )

        heartbeat_token = generate_heartbeat_token()
        heartbeat_token_hash = hash_heartbeat_token(
            heartbeat_token
        )

        device = Device(
            organization_id=current_user.organization_id,
            name=request.name,
            device_identifier=request.device_identifier,
            description=request.description,
            device_type=request.device_type,
            is_active=True,
            heartbeat_token_hash=heartbeat_token_hash,
        )

        DeviceRepository.create(
            db,
            device,
        )

        db.commit()
        db.refresh(device)

        return device, heartbeat_token

    @staticmethod
    def heartbeat(
        db: Session,
        device_id: UUID,
        token: str,
    ) -> Device:
        device = DeviceRepository.get_by_id_without_organization(
            db,
            device_id,
        )

        if device is None:
            raise ValueError("Device not found.")

        if not device.is_active:
            raise PermissionError(
                "Device is inactive."
            )

        if device.heartbeat_token_hash is None:
            raise PermissionError(
                "Device heartbeat is not configured."
            )

        if not verify_heartbeat_token(
            token,
            device.heartbeat_token_hash,
        ):
            raise PermissionError(
                "Invalid device heartbeat token."
            )

        device.last_seen = datetime.utcnow()

        DeviceRepository.update(
            db,
            device,
        )

        db.commit()
        db.refresh(device)

        return device

    @staticmethod
    def list(
        db: Session,
        current_user: User,
    ) -> tuple[list[Device], int]:
        devices = DeviceRepository.list_by_organization(
            db,
            current_user.organization_id,
        )

        total = DeviceRepository.count_by_organization(
            db,
            current_user.organization_id,
        )

        return devices, total

    @staticmethod
    def get(
        db: Session,
        current_user: User,
        device_id: UUID,
    ) -> Device:
        device = DeviceRepository.get_by_id(
            db,
            device_id,
            current_user.organization_id,
        )

        if device is None:
            raise ValueError("Device not found.")

        return device

    @staticmethod
    def update(
        db: Session,
        current_user: User,
        device_id: UUID,
        request: DeviceUpdateRequest,
    ) -> Device:
        device = DeviceRepository.get_by_id(
            db,
            device_id,
            current_user.organization_id,
        )

        if device is None:
            raise ValueError("Device not found.")

        if request.name is not None:
            device.name = request.name

        if request.description is not None:
            device.description = request.description

        if request.device_type is not None:
            device.device_type = request.device_type

        if request.is_active is not None:
            device.is_active = request.is_active

        DeviceRepository.update(
            db,
            device,
        )

        db.commit()
        db.refresh(device)

        return device

    @staticmethod
    def delete(
        db: Session,
        current_user: User,
        device_id: UUID,
    ) -> None:
        device = DeviceRepository.get_by_id(
            db,
            device_id,
            current_user.organization_id,
        )

        if device is None:
            raise ValueError("Device not found.")

        DeviceRepository.delete(
            db,
            device,
        )

        db.commit()