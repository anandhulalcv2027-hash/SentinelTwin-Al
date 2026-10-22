from typing import List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, asc, desc

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.device import Device
from app.models.device_telemetry import DeviceTelemetry
from app.models.security_telemetry import SecurityTelemetry
from app.models.threat_event import ThreatEvent
from app.models.alert import Alert
from app.models.incident import Incident
from app.services.device_service import DeviceService

router = APIRouter()

@router.get("/telemetry")
def get_historical_telemetry(
    device_id: UUID,
    start_time: datetime,
    end_time: datetime,
    limit: int = 1000,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    DeviceService.get(db, current_user, device_id)
    
    query = select(DeviceTelemetry).where(
        DeviceTelemetry.device_id == device_id,
        DeviceTelemetry.collected_at >= start_time,
        DeviceTelemetry.collected_at <= end_time
    ).order_by(asc(DeviceTelemetry.collected_at)).limit(limit)
    
    results = db.scalars(query).all()
    return results

@router.get("/security-telemetry")
def get_historical_security_telemetry(
    device_id: UUID,
    start_time: datetime,
    end_time: datetime,
    limit: int = 1000,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    DeviceService.get(db, current_user, device_id)
    
    query = select(SecurityTelemetry).where(
        SecurityTelemetry.device_id == device_id,
        SecurityTelemetry.collected_at >= start_time,
        SecurityTelemetry.collected_at <= end_time
    ).order_by(asc(SecurityTelemetry.collected_at)).limit(limit)
    
    results = db.scalars(query).all()
    return results

@router.get("/threats")
def get_historical_threats(
    device_id: Optional[UUID] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    severity: Optional[str] = None,
    limit: int = 1000,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(ThreatEvent).where(ThreatEvent.organization_id == current_user.organization_id)
    
    if device_id:
        query = query.where(ThreatEvent.device_id == device_id)
    if start_time:
        query = query.where(ThreatEvent.detected_at >= start_time)
    if end_time:
        query = query.where(ThreatEvent.detected_at <= end_time)
    if severity:
        query = query.where(ThreatEvent.severity == severity)
        
    query = query.order_by(desc(ThreatEvent.detected_at)).limit(limit)
    results = db.scalars(query).all()
    return results

@router.get("/topology")
def get_network_topology(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch all devices for the org
    devices = db.scalars(select(Device).where(Device.organization_id == current_user.organization_id)).all()
    
    nodes = []
    edges = []
    seen_ips = set()
    
    # Create nodes for devices
    for d in devices:
        nodes.append({
            "id": str(d.id),
            "type": "device",
            "data": {"label": d.name, "device_type": d.device_type, "is_isolated": d.is_isolated}
        })
        
        # Get latest security telemetry for network connections
        latest_sec = db.scalar(
            select(SecurityTelemetry)
            .where(SecurityTelemetry.device_id == d.id)
            .order_by(desc(SecurityTelemetry.collected_at))
            .limit(1)
        )
        
        if latest_sec and latest_sec.network_connections:
            for conn in latest_sec.network_connections:
                remote_ip = conn.get("remote_ip")
                if remote_ip and remote_ip not in ("0.0.0.0", "127.0.0.1", "::1", ""):
                    node_id = f"ip-{remote_ip}"
                    if remote_ip not in seen_ips:
                        nodes.append({
                            "id": node_id,
                            "type": "remote_ip",
                            "data": {"label": remote_ip}
                        })
                        seen_ips.add(remote_ip)
                    
                    edges.append({
                        "id": f"edge-{d.id}-{remote_ip}-{conn.get('remote_port', '')}",
                        "source": str(d.id),
                        "target": node_id,
                        "label": f"Port {conn.get('remote_port', 'unknown')}"
                    })
                    
    return {"nodes": nodes, "edges": edges}
from app.services.audit_service import AuditService

@router.get("/audit/verify")
def verify_audit_chain(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_valid = AuditService.verify_chain(db, current_user.organization_id)
    return {"organization_id": current_user.organization_id, "is_chain_valid": is_valid}
