from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.device import (
    DeviceCreateRequest,
    DeviceCreateResponse,
    DeviceHeartbeatResponse,
    DeviceListResponse,
    DeviceResponse,
    DeviceTelemetryRequest,
    DeviceTelemetryResponse,
    DeviceUpdateRequest,
)
from app.services.device_service import DeviceService
from app.services.device_telemetry_service import (
    DeviceTelemetryService,
)


router = APIRouter(
    prefix="/devices",
    tags=["Devices"],
)


@router.post(
    "",
    response_model=DeviceCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_device(
    request: DeviceCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        device, heartbeat_token = DeviceService.create(
            db,
            current_user,
            request,
        )

        return DeviceCreateResponse(
            device=device,
            heartbeat_token=heartbeat_token,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "",
    response_model=DeviceListResponse,
)
def list_devices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    devices, total = DeviceService.list(
        db,
        current_user,
    )

    return DeviceListResponse(
        items=devices,
        total=total,
    )


@router.post(
    "/{device_id}/telemetry",
    response_model=DeviceTelemetryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_device_telemetry(
    device_id: UUID,
    request: DeviceTelemetryRequest,
    x_device_token: str | None = Header(
        default=None,
        alias="X-Device-Token",
    ),
    db: Session = Depends(get_db),
):
    if not x_device_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Device heartbeat token is required.",
        )

    try:
        return DeviceTelemetryService.create(
            db,
            device_id,
            x_device_token,
            request,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.get(
    "/{device_id}/telemetry/latest",
    response_model=DeviceTelemetryResponse,
)
def get_latest_device_telemetry(
    device_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # Verify that the device belongs to the
        # current user's organization.
        DeviceService.get(
            db,
            current_user,
            device_id,
        )

        return DeviceTelemetryService.get_latest(
            db,
            device_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get(
    "/{device_id}",
    response_model=DeviceResponse,
)
def get_device(
    device_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return DeviceService.get(
            db,
            current_user,
            device_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.post(
    "/{device_id}/heartbeat",
    response_model=DeviceHeartbeatResponse,
)
def heartbeat_device(
    device_id: UUID,
    x_device_token: str | None = Header(
        default=None,
        alias="X-Device-Token",
    ),
    db: Session = Depends(get_db),
):
    if not x_device_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Device heartbeat token is required.",
        )

    try:
        device = DeviceService.heartbeat(
            db,
            device_id,
            x_device_token,
        )

        return DeviceHeartbeatResponse(
            device_id=device.id,
            status="online",
            last_seen=device.last_seen,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.patch(
    "/{device_id}",
    response_model=DeviceResponse,
)
def update_device(
    device_id: UUID,
    request: DeviceUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return DeviceService.update(
            db,
            current_user,
            device_id,
            request,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/{device_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_device(
    device_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        DeviceService.delete(
            db,
            current_user,
            device_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    return None