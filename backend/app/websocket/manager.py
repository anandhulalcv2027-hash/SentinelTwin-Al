from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket


class WebSocketManager:
    """Manage authenticated dashboard WebSocket connections by organization."""

    def __init__(self) -> None:
        self._connections: dict[UUID, set[WebSocket]] = defaultdict(set)

    async def connect(
        self,
        organization_id: UUID,
        websocket: WebSocket,
    ) -> None:
        await websocket.accept()
        self._connections[organization_id].add(websocket)

    async def disconnect(
        self,
        organization_id: UUID,
        websocket: WebSocket,
    ) -> None:
        connections = self._connections.get(organization_id)

        if connections is None:
            return

        connections.discard(websocket)

        if not connections:
            self._connections.pop(organization_id, None)

    async def broadcast_to_organization(
        self,
        organization_id: UUID,
        message: dict,
    ) -> None:
        connections = self._connections.get(organization_id)

        if not connections:
            return

        disconnected: list[WebSocket] = []

        for websocket in list(connections):
            try:
                await websocket.send_json(message)
            except Exception:
                disconnected.append(websocket)

        for websocket in disconnected:
            await self.disconnect(
                organization_id,
                websocket,
            )


websocket_manager = WebSocketManager()