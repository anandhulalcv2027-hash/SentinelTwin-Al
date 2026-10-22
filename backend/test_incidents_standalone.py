from app.db.session import SessionLocal
from app.models.user import User
import uuid

def test_incidents_standalone():
    db = SessionLocal()
    from app.services.incident_service import IncidentService
    from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentStatus, IncidentSeverity
    from app.models.organization import Organization
    from app.models.device import Device
    
    org_id = uuid.uuid4()
    dev_id = uuid.uuid4()
    
    try:
        org = Organization(id=org_id, name="Inc Org", slug=str(org_id), email="inc@org.com")
        db.add(org)
        dev = Device(id=dev_id, organization_id=org_id, name="Inc Dev", device_identifier="inc-dev-1", is_active=True)
        db.add(dev)
        db.commit()
        
        # Test Create
        inc_in = IncidentCreate(
            organization_id=org_id,
            device_id=dev_id,
            title="Standalone Test",
            description="Testing incidents",
            severity=IncidentSeverity.HIGH
        )
        incident = IncidentService.create_incident(db, inc_in)
        assert incident.title == "Standalone Test"
        assert incident.status == IncidentStatus.OPEN
        
        # Test Get
        fetched = IncidentService.get_incident(db, incident.id, org_id)
        assert fetched is not None
        assert fetched.id == incident.id
        
        # Test List
        all_incs = IncidentService.get_organization_incidents(db, org_id)
        assert len(all_incs) == 1
        
        # Test Update
        update_in = IncidentUpdate(status=IncidentStatus.ACKNOWLEDGED)
        updated = IncidentService.update_incident(db, incident.id, org_id, update_in)
        assert updated.status == IncidentStatus.ACKNOWLEDGED
        assert updated.acknowledged_at is not None
        
        # Test Resolve
        resolve_in = IncidentUpdate(status=IncidentStatus.RESOLVED)
        resolved = IncidentService.update_incident(db, incident.id, org_id, resolve_in)
        assert resolved.status == IncidentStatus.RESOLVED
        assert resolved.resolved_at is not None
        
        print("--- INCIDENT MANAGEMENT TESTS PASSED ---")
        
    finally:
        db.rollback()
        from app.models.incident import Incident
        db.query(Incident).filter(Incident.organization_id == org_id).delete()
        db.query(Device).filter(Device.id == dev_id).delete()
        db.query(Organization).filter(Organization.id == org_id).delete()
        db.commit()

if __name__ == "__main__":
    test_incidents_standalone()
