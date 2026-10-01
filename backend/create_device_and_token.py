import uuid
import sys
from app.db.session import SessionLocal
from app.services.auth_service import AuthService
from app.services.device_service import DeviceService
from app.services.user_service import UserService
from app.schemas.auth import RegisterRequest
from app.schemas.device import DeviceCreateRequest

def setup_test_environment():
    db = SessionLocal()
    
    try:
        # 1. Register a test organization and user
        register_req = RegisterRequest(
            organization_name="Test Org",
            organization_slug="test-org",
            username="testadmin",
            email="test2@example.com",
            password="StrongPassword123!",
            first_name="Test",
            last_name="Admin"
        )
        try:
            AuthService.register(db, register_req)
            print(f"Created user: {register_req.email}")
        except Exception as e:
            print(f"User might already exist: {e}")
            
        from sqlalchemy import select
        from app.models.user import User
        user = db.scalar(select(User).where(User.email == "test2@example.com"))
            
        # 2. Create a test device
        device_req = DeviceCreateRequest(
            name="Test Local Machine",
            device_identifier=str(uuid.uuid4()),
            description="End-to-end test device",
            device_type="endpoint"
        )
        
        device, heartbeat_token, enrollment_token = DeviceService.create(
            db, user, device_req
        )
        
        print(f"Created device: {device.name}")
        print(f"Device ID: {device.id}")
        print(f"Enrollment Token: {enrollment_token}")
        
    finally:
        db.close()

if __name__ == "__main__":
    setup_test_environment()
