import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.repositories.device_repository import DeviceRepository

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:SentinelTwin12345@localhost:5432/sentineltwin")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

device_id = uuid.UUID("20d45587-7777-4f49-8275-9f799b42fd00")
device = DeviceRepository.get_by_id_without_organization(db, device_id)
print("Device found:", device)
if device:
    print("Is active:", device.is_active)

