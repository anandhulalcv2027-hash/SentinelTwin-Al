from datetime import timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.device import Device
from app.models.device_enrollment_token import DeviceEnrollmentToken
from app.security.device_enrollment import generate_enrollment_token, hash_enrollment_token
import os
import uuid
from datetime import datetime, timedelta

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:SentinelTwin12345@localhost:5432/sentineltwin")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Find specific device
device = db.query(Device).filter(Device.id == "20d45587-7777-4f49-8275-9f799b42fd00").first()
if not device:
    device = Device(
        id=uuid.uuid4(),
        hostname="TestDevice",
        operating_system="Windows",
        os_version="10",
        agent_version="0.1.0",
        is_active=True
    )
    db.add(device)
    db.commit()

# Create enrollment token
token = generate_enrollment_token()
token_hash = hash_enrollment_token(token)

enrollment = DeviceEnrollmentToken(
    device_id=device.id,
    token_hash=token_hash,
    expires_at=datetime.now(timezone.utc) + timedelta(days=1)
)
db.add(enrollment)
db.commit()

print(f"ENROLLMENT_TOKEN={token}")
