import hashlib
import json
from datetime import datetime
from uuid import UUID
from typing import Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from app.models.audit_log import AuditLog

class AuditService:
    @staticmethod
    def _canonicalize(data: dict) -> str:
        """Serialize data in a deterministic way."""
        return json.dumps(data, sort_keys=True, default=str)

    @staticmethod
    def _hash_record(previous_hash: str, payload_str: str) -> str:
        """Generate SHA-256 hash of previous hash + canonicalized payload."""
        hasher = hashlib.sha256()
        if previous_hash:
            hasher.update(previous_hash.encode('utf-8'))
        hasher.update(payload_str.encode('utf-8'))
        return hasher.hexdigest()

    @staticmethod
    def create_log(
        db: Session,
        organization_id: Optional[UUID],
        actor_user_id: Optional[UUID],
        action: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        details: Optional[dict] = None
    ) -> AuditLog:
        
        # Get the previous hash for the organization's chain
        # If organization_id is None, it uses a global system chain
        query = select(AuditLog)
        if organization_id:
            query = query.where(AuditLog.organization_id == organization_id)
        else:
            query = query.where(AuditLog.organization_id.is_(None))
            
        last_log = db.scalar(query.order_by(desc(AuditLog.created_at)).limit(1))
        
        previous_hash = last_log.current_hash if last_log and last_log.current_hash else "0" * 64
        
        # Build payload for hashing
        payload = {
            "organization_id": str(organization_id) if organization_id else None,
            "actor_user_id": str(actor_user_id) if actor_user_id else None,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details
        }
        
        payload_str = AuditService._canonicalize(payload)
        current_hash = AuditService._hash_record(previous_hash, payload_str)
        
        new_log = AuditLog(
            organization_id=organization_id,
            actor_user_id=actor_user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=ip_address,
            user_agent=user_agent,
            details=details,
            previous_hash=previous_hash,
            current_hash=current_hash
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log

    @staticmethod
    def verify_chain(db: Session, organization_id: Optional[UUID] = None) -> bool:
        """Verify the cryptographic integrity of the audit log chain."""
        query = select(AuditLog)
        if organization_id:
            query = query.where(AuditLog.organization_id == organization_id)
        else:
            query = query.where(AuditLog.organization_id.is_(None))
            
        logs = db.scalars(query.order_by(AuditLog.created_at.asc())).all()
        
        expected_prev_hash = "0" * 64
        for log in logs:
            # Check link
            if log.previous_hash != expected_prev_hash:
                return False
                
            # Check content integrity
            payload = {
                "organization_id": str(log.organization_id) if log.organization_id else None,
                "actor_user_id": str(log.actor_user_id) if log.actor_user_id else None,
                "action": log.action,
                "resource_type": log.resource_type,
                "resource_id": log.resource_id,
                "details": log.details
            }
            payload_str = AuditService._canonicalize(payload)
            expected_current = AuditService._hash_record(log.previous_hash, payload_str)
            
            if log.current_hash != expected_current:
                return False
                
            expected_prev_hash = log.current_hash
            
        return True
