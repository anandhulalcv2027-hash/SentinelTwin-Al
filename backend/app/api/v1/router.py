from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.device import router as device_router
from app.api.v1.endpoints.role import router as role_router
from app.api.v1.endpoints.user import router as user_router
from app.api.v1.endpoints.alert import router as alert_router
from app.api.v1.endpoints.websocket import router as websocket_router
from app.api.v1.endpoints.threat import router as threat_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(device_router)
api_router.include_router(user_router)
api_router.include_router(role_router)
api_router.include_router(alert_router)
api_router.include_router(websocket_router)
api_router.include_router(threat_router)