from app.db.session import SessionLocal
from app.services.audit_service import AuditService
from app.models.organization import Organization
from app.models.user import User
import uuid
import json

def test_audit_logging():
    db = SessionLocal()
    org_id = uuid.uuid4()
    actor_id = uuid.uuid4()
    
    try:
        # Create an org
        org = Organization(id=org_id, name="Audit Org", slug=str(org_id), email="audit@org.com")
        db.add(org)
        db.commit()

        print("Testing Audit Log Hash Chain...")
        # Create 3 logs
        log1 = AuditService.create_log(
            db=db,
            organization_id=org_id,
            actor_user_id=None,
            action="LOGIN_SUCCESS",
            details={"ip": "192.168.1.1"}
        )
        
        log2 = AuditService.create_log(
            db=db,
            organization_id=org_id,
            actor_user_id=None,
            action="CREATE_INCIDENT",
            resource_type="Incident",
            resource_id="INC-123"
        )

        log3 = AuditService.create_log(
            db=db,
            organization_id=org_id,
            actor_user_id=None,
            action="RESOLVE_INCIDENT",
            resource_type="Incident",
            resource_id="INC-123"
        )
        
        # Verify Chain
        is_valid = AuditService.verify_chain(db, org_id)
        assert is_valid == True, "Chain should be valid"
        
        print("Chain is valid. Testing tamper detection...")
        
        # Tamper with log2
        log2.action = "DELETE_INCIDENT"
        db.commit()
        
        is_valid_after_tamper = AuditService.verify_chain(db, org_id)
        assert is_valid_after_tamper == False, "Chain should be INVALID after tampering"
        
        print("Tamper detection SUCCESSFUL.")
        print("--- PHASE 16 AUDIT LOGGING VERIFIED ---")
        
    finally:
        db.rollback()
        from app.models.audit_log import AuditLog
        db.query(AuditLog).filter(AuditLog.organization_id == org_id).delete()
        db.query(Organization).filter(Organization.id == org_id).delete()
        db.commit()

if __name__ == "__main__":
    test_audit_logging()
