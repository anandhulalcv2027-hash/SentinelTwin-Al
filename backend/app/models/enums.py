from enum import Enum


class OrganizationStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"

class EmployeeStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"

class DeviceType(str, Enum):
    LAPTOP = "LAPTOP"
    DESKTOP = "DESKTOP"
    SERVER = "SERVER"
    FIREWALL = "FIREWALL"
    ROUTER = "ROUTER"
    SWITCH = "SWITCH"
    CLOUD_VM = "CLOUD_VM"
    IOT_DEVICE = "IOT_DEVICE"

class DeviceStatus(str, Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
    MAINTENANCE = "MAINTENANCE"
    COMPROMISED = "COMPROMISED"

class HealthStatus(str, Enum):
    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED"
    CRITICAL = "CRITICAL"
    UNKNOWN = "UNKNOWN"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class NetworkStatus(str, Enum):
    CONNECTED = "CONNECTED"
    DISCONNECTED = "DISCONNECTED"
    UNSTABLE = "UNSTABLE"

class HeartbeatStatus(str, Enum):
    SUCCESS = "SUCCESS"
    MISSED = "MISSED"

class ThreatSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class AlertStatus(str, Enum):
    NEW = "NEW"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"
    DISMISSED = "DISMISSED"