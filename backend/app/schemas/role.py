from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RoleResponse(BaseModel):
    id: UUID
    name: str
    description: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class RoleListResponse(BaseModel):
    items: list[RoleResponse]
    total: int