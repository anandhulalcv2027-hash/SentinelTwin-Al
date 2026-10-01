from uuid import UUID

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

from app.core.config import settings
from app.db.session import SessionLocal
from app.repositories.user_repository import UserRepository
from app.security.jwt import verify_token
from app.websocket.manager import websocket_manager


router = APIRouter(
    tags=["WebSocket"],
)


@router.websocket("/ws/telemetry")
async def telemetry_websocket(
    websocket: WebSocket,
    token: str | None = Query(default=None),
) -> None:
    # WebSocket connections do not use normal CORS middleware,
    # so validate the browser origin explicitly.
    origin = websocket.headers.get("origin")

    if origin and origin not in settings.cors_origin_list:
        await websocket.close(code=1008)
        return

    # Browser WebSocket clients cannot attach the normal
    # Authorization header through the WebSocket constructor.
    # The access token is therefore supplied as a query parameter.
    if not token:
        await websocket.close(code=1008)
        return

    payload = verify_token(token)

    if payload is None:
        await websocket.close(code=1008)
        return

    user_id = payload.get("user_id")

    if not user_id:
        await websocket.close(code=1008)
        return

    try:
        user_uuid = UUID(str(user_id))
    except ValueError:
        await websocket.close(code=1008)
        return

    db = SessionLocal()

    try:
        user = UserRepository.get_user_by_id(
            db,
            user_uuid,
        )

        if user is None or not user.is_active:
            await websocket.close(code=1008)
            return

        organization_id = user.organization_id

    finally:
        db.close()

    await websocket_manager.connect(
        organization_id,
        websocket,
    )

    try:
        await websocket.send_json(
            {
                "type": "connection.ready",
                "organization_id": str(organization_id),
            }
        )

        while True:
            message = await websocket.receive_text()

            if message == "ping":
                await websocket.send_json(
                    {
                        "type": "pong",
                    }
                )

    except WebSocketDisconnect:
        pass

    finally:
        await websocket_manager.disconnect(
            organization_id,
            websocket,
        )