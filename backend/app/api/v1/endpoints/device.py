from uuid import UUID

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    Header,
    HTTPException,
    status,
)
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.websocket.manager import websocket_manager
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
from app.services.agent_package_service import AgentPackageService
from app.schemas.device_enrollment import (
    DeviceEnrollmentRequest,
    DeviceEnrollmentResponse,
)
from app.services.device_enrollment_service import (
    DeviceEnrollmentService,
)
from app.services.twin_service import TwinService



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
        device, heartbeat_token, enrollment_token = DeviceService.create(
            db,
            current_user,
            request,
        )

        return DeviceCreateResponse(
            device=device,
            heartbeat_token=heartbeat_token,
            enrollment_token=enrollment_token,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/enroll",
    response_model=DeviceEnrollmentResponse,
)
def enroll_device(
    request: DeviceEnrollmentRequest,
    db: Session = Depends(get_db),
):
    try:
        device, heartbeat_token = DeviceEnrollmentService.enroll(
            db,
            request.enrollment_token,
        )

        return DeviceEnrollmentResponse(
            device_id=device.id,
            heartbeat_token=heartbeat_token,
            status="enrolled",
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )


@router.get(
    "/{device_id}/agent-package",
)
def download_agent_package(
    device_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        device = DeviceService.get(
            db,
            current_user,
            device_id,
        )

        package = AgentPackageService.create_package(
            db,
            device,
        )

        filename = (
            f"SentinelTwin-Agent-"
            f"{device.device_identifier}.zip"
        )

        return Response(
            content=package,
            media_type="application/zip",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{filename}"'
                )
            },
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
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
    background_tasks: BackgroundTasks,
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
        telemetry, threat_event, alert, is_alert_new = DeviceTelemetryService.create(
            db,
            device_id,
            x_device_token,
            request,
        )

        organization_id = (
            DeviceTelemetryService.get_organization_id(
                db,
                device_id,
            )
        )

        telemetry_payload = (
            DeviceTelemetryResponse.model_validate(
                telemetry
            ).model_dump(mode="json")
        )

        background_tasks.add_task(
            websocket_manager.broadcast_to_organization,
            organization_id,
            {
                "type": "telemetry.updated",
                "device_id": str(device_id),
                "telemetry": telemetry_payload,
            },
        )
        
        twin_data = TwinService.get_twin_data(db, device_id)
        background_tasks.add_task(
            websocket_manager.broadcast_to_organization,
            organization_id,
            {
                "type": "twin.updated",
                "device_id": str(device_id),
                "twin": twin_data,
            },
        )
        
        if threat_event:
            from app.schemas.threat_event import ThreatEventResponse
            threat_payload = ThreatEventResponse.model_validate(threat_event)
            background_tasks.add_task(
                websocket_manager.broadcast_to_organization,
                organization_id,
                {
                    "type": "threat.detected",
                    "device_id": str(device_id),
                    "threat": threat_payload.model_dump(mode="json"),
                },
            )
            
        if alert:
            # We don't have a Pydantic schema for Alert readily available to dump, we can just build a dict
            alert_payload = {
                "id": str(alert.id),
                "device_id": str(alert.device_id),
                "alert_type": alert.alert_type,
                "severity": alert.severity,
                "title": alert.title,
                "message": alert.message,
                "metric_value": alert.metric_value,
                "status": alert.status
            }
            background_tasks.add_task(
                websocket_manager.broadcast_to_organization,
                organization_id,
                {
                    "type": "alert.created" if is_alert_new else "alert.updated",
                    "device_id": str(device_id),
                    "alert": alert_payload,
                },
            )

        return telemetry

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

from app.schemas.security_telemetry import SecurityTelemetryRequest, SecurityTelemetryResponse
from app.services.security_telemetry_service import SecurityTelemetryService

@router.post(
    "/{device_id}/security-telemetry",
    response_model=SecurityTelemetryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_device_security_telemetry(
    device_id: UUID,
    request: SecurityTelemetryRequest,
    background_tasks: BackgroundTasks,
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
        telemetry = SecurityTelemetryService.create(
            db,
            device_id,
            x_device_token,
            request,
        )
        return telemetry

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
    "/{device_id}/security-telemetry/latest",
    response_model=SecurityTelemetryResponse,
)
def get_latest_device_security_telemetry(
    device_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        DeviceService.get(
            db,
            current_user,
            device_id,
        )

        return SecurityTelemetryService.get_latest(
            db,
            device_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
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


@router.get(
    "/{device_id}/twin",
)
def get_device_twin(
    device_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # Verify that the device belongs to the current user's organization.
        DeviceService.get(
            db,
            current_user,
            device_id,
        )

        return TwinService.get_twin_data(db, device_id)

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

    print("DEBUG: heartbeat_device called with", device_id, type(device_id))
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
            is_isolated=device.is_isolated,
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

@router.post(
    "/{device_id}/isolate",
    response_model=DeviceResponse,
)
def isolate_device(
    device_id: UUID,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        device = DeviceService.isolate(
            db,
            current_user,
            device_id,
        )

        twin_data = TwinService.get_twin_data(db, device_id)
        # Update twin with isolated info if needed (the TwinService can also be modified to force CRITICAL)
        
        # Broadcast the twin update
        background_tasks.add_task(
            websocket_manager.broadcast_to_organization,
            current_user.organization_id,
            {
                "type": "twin.updated",
                "device_id": str(device_id),
                "twin": twin_data,
            },
        )
        
        return device

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )