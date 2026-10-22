from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DeviceCreateRequest(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=150,
    )

    device_identifier: str = Field(
        min_length=1,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=2000,
    )

    device_type: str = Field(
        default="endpoint",
        max_length=100,
    )


class DeviceUpdateRequest(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        max_length=2000,
    )

    device_type: str | None = Field(
        default=None,
        max_length=100,
    )

    is_active: bool | None = None


class DeviceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    name: str
    device_identifier: str
    description: str | None
    device_type: str
    is_active: bool
    is_isolated: bool
    last_seen: datetime | None
    created_at: datetime
    updated_at: datetime

class DeviceCreateResponse(BaseModel):
    device: DeviceResponse
    heartbeat_token: str
    enrollment_token: str

class DeviceListResponse(BaseModel):
    items: list[DeviceResponse]
    total: int  

class DeviceHeartbeatResponse(BaseModel):
    device_id: UUID
    status: str
    is_isolated: bool
    last_seen: datetime

class DeviceTelemetryRequest(BaseModel):
    hostname: str = Field(
        min_length=1,
        max_length=255,
    )

    operating_system: str = Field(
        min_length=1,
        max_length=100,
    )

    os_version: str = Field(
        min_length=1,
        max_length=255,
    )

    cpu_usage_percent: float = Field(
        ge=0,
        le=100,
    )

    memory_usage_percent: float = Field(
        ge=0,
        le=100,
    )

    disk_usage_percent: float = Field(
        ge=0,
        le=100,
    )

    uptime_seconds: int = Field(
        ge=0,
    )

    network_bytes_sent: int = Field(
        default=0,
        ge=0,
    )

    network_bytes_recv: int = Field(
        default=0,
        ge=0,
    )

    active_connections: int = Field(
        default=0,
        ge=0,
    )

    process_count: int = Field(
        default=0,
        ge=0,
    )

    failed_logins: int = Field(
        default=0,
        ge=0,
    )

    agent_version: str = Field(
        min_length=1,
        max_length=50,
    )


class DeviceTelemetryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    device_id: UUID
    hostname: str
    operating_system: str
    os_version: str
    cpu_usage_percent: float
    memory_usage_percent: float
    disk_usage_percent: float
    uptime_seconds: int
    network_bytes_sent: int
    network_bytes_recv: int
    active_connections: int
    process_count: int
    failed_logins: int
    agent_version: str
    collected_at: datetime