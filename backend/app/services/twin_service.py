from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.device_live_state import DeviceLiveState
from app.models.digital_twin import DigitalTwin
from app.models.device_telemetry import DeviceTelemetry
from app.models.enums import HealthStatus, RiskLevel, NetworkStatus
from app.repositories.device_live_state_repository import DeviceLiveStateRepository
from app.repositories.digital_twin_repository import DigitalTwinRepository
from app.repositories.device_repository import DeviceRepository
from app.schemas.device import DeviceTelemetryRequest
from app.models.ai_prediction import AIPrediction


class TwinService:

    @staticmethod
    def sync_from_telemetry(
        db: Session,
        device_id: UUID,
        telemetry: DeviceTelemetry | DeviceTelemetryRequest,
        prediction: AIPrediction | None = None,
    ) -> tuple[DeviceLiveState, DigitalTwin]:
        """
        Synchronizes the live state and digital twin based on incoming telemetry and AI predictions.
        """
        
        # 1. Update or create Live State
        live_state = DeviceLiveStateRepository.get_by_device_id(db, device_id)
        if not live_state:
            live_state = DeviceLiveState(device_id=device_id)
            DeviceLiveStateRepository.create(db, live_state)
        
        live_state.cpu_usage = telemetry.cpu_usage_percent
        live_state.memory_usage = telemetry.memory_usage_percent
        live_state.disk_usage = telemetry.disk_usage_percent
        live_state.network_status = NetworkStatus.CONNECTED
        live_state.last_seen = datetime.utcnow()
        # process_count could be added to telemetry later, defaulting to 0 for now
        
        DeviceLiveStateRepository.update(db, live_state)

        # 2. Update or create Digital Twin
        twin = DigitalTwinRepository.get_by_device_id(db, device_id)
        if not twin:
            twin = DigitalTwin(device_id=device_id)
            DigitalTwinRepository.create(db, twin)
            
        # AI-based health and risk
        if prediction and prediction.prediction.get("is_anomaly"):
            threat = prediction.prediction.get("threat_type", "Unknown")
            if threat in ["Ransomware / High I/O", "Memory Exhaustion"]:
                twin.health_status = HealthStatus.CRITICAL
                twin.risk_level = RiskLevel.CRITICAL
            else:
                twin.health_status = HealthStatus.DEGRADED
                twin.risk_level = RiskLevel.HIGH
        else:
            # Fallback heuristics or healthy
            if telemetry.cpu_usage_percent > 90 or telemetry.memory_usage_percent > 95:
                twin.health_status = HealthStatus.CRITICAL
                twin.risk_level = RiskLevel.HIGH
            elif telemetry.cpu_usage_percent > 75 or telemetry.memory_usage_percent > 80:
                twin.health_status = HealthStatus.DEGRADED
                twin.risk_level = RiskLevel.MEDIUM
            else:
                twin.health_status = HealthStatus.HEALTHY
                twin.risk_level = RiskLevel.LOW
            
        DigitalTwinRepository.update(db, twin)
        
        return live_state, twin

    @staticmethod
    def get_twin_data(
        db: Session,
        device_id: UUID,
    ) -> dict:
        """
        Returns the combined live state and twin status for frontend visualization.
        """
        live_state = DeviceLiveStateRepository.get_by_device_id(db, device_id)
        twin = DigitalTwinRepository.get_by_device_id(db, device_id)
        device = DeviceRepository.get_by_id_without_organization(db, device_id)
        
        is_isolated = device.is_isolated if device else False
        
        return {
            "device_id": str(device_id),
            "is_isolated": is_isolated,
            "live_state": {
                "cpu_usage": live_state.cpu_usage if live_state else 0.0,
                "memory_usage": live_state.memory_usage if live_state else 0.0,
                "disk_usage": live_state.disk_usage if live_state else 0.0,
                "network_status": NetworkStatus.DISCONNECTED if is_isolated else (live_state.network_status if live_state else NetworkStatus.DISCONNECTED),
                "last_seen": live_state.last_seen.isoformat() if live_state and live_state.last_seen else None,
            },
            "twin": {
                "health_status": HealthStatus.CRITICAL if is_isolated else (twin.health_status if twin else HealthStatus.UNKNOWN),
                "risk_level": RiskLevel.CRITICAL if is_isolated else (twin.risk_level if twin else RiskLevel.LOW),
            }
        }
