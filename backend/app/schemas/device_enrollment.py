from uuid import UUID

from pydantic import BaseModel


class DeviceEnrollmentRequest(BaseModel):
    enrollment_token: str


class DeviceEnrollmentResponse(BaseModel):
    device_id: UUID
    heartbeat_token: str
    status: str