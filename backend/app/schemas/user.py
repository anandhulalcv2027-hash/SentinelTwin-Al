from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    first_name: str
    last_name: str
    organization_id: UUID
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True,
    )