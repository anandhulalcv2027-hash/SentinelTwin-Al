from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

class ProcessInfo(BaseModel):
    pid: int
    name: str
    exe: str | None = None
    username: str | None = None
    ppid: int | None = None
    cpu_percent: float | None = None
    memory_percent: float | None = None
    create_time: float | None = None

class NetworkConnection(BaseModel):
    local_address: str | None = None
    remote_address: str | None = None
    protocol: str
    status: str | None = None
    pid: int | None = None

class OpenPort(BaseModel):
    port: int
    protocol: str
    bind_address: str | None = None
    pid: int | None = None

class AuthenticationEvent(BaseModel):
    event_type: str
    account: str | None = None
    timestamp: float
    source: str | None = None

class SecurityTelemetryRequest(BaseModel):
    processes: list[ProcessInfo] = Field(default_factory=list)
    network_connections: list[NetworkConnection] = Field(default_factory=list)
    open_ports: list[OpenPort] = Field(default_factory=list)
    authentication_events: list[AuthenticationEvent] = Field(default_factory=list)
    firewall_enabled: bool | None = None
    security_events: list[dict] = Field(default_factory=list)

class SecurityTelemetryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    device_id: UUID
    processes: list[ProcessInfo]
    network_connections: list[NetworkConnection]
    open_ports: list[OpenPort]
    authentication_events: list[AuthenticationEvent]
    firewall_enabled: bool | None
    security_events: list[dict]
    collected_at: datetime
