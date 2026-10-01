import time
import requests
from datetime import datetime
from uuid import UUID

from app.db.session import SessionLocal
from app.models.device import Device
from app.security.device_heartbeat import hash_heartbeat_token, generate_heartbeat_token

API_BASE_URL = "http://localhost:8000/api/v1"

def setup_test_device():
    db = SessionLocal()
    device = db.query(Device).first()
    if not device:
        print("No device found in DB. Please register one via UI first.")
        db.close()
        return None, None
        
    import uuid
    # Generate a known token and update the hash
    known_token = f"test_simulator_token_{uuid.uuid4().hex[:8]}"
    device.heartbeat_token_hash = hash_heartbeat_token(known_token)
    device.is_active = True
    db.commit()
    
    device_id = str(device.id)
    db.close()
    return device_id, known_token

def send_telemetry(device_id: str, token: str, cpu: float, memory: float, disk: float):
    url = f"{API_BASE_URL}/devices/{device_id}/telemetry"
    headers = {
        "X-Device-Token": token,
        "Content-Type": "application/json"
    }
    payload = {
        "hostname": "simulator-node",
        "operating_system": "Windows 11",
        "os_version": "10.0.22621",
        "cpu_usage_percent": cpu,
        "memory_usage_percent": memory,
        "disk_usage_percent": disk,
        "uptime_seconds": 3600,
        "agent_version": "1.0.0"
    }
    
    print(f"Sending telemetry -> CPU: {cpu}%, RAM: {memory}%")
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 201:
        print("[SUCCESS] Telemetry accepted")
    else:
        print(f"[FAIL] {response.status_code} - {response.text}")

def main():
    print("--- SentinelTwin AI Attack Simulator ---")
    device_id, token = setup_test_device()
    if not device_id:
        return
        
    print(f"Targeting Device: {device_id}")
    
    print("\nPhase 1: Normal Operation (Healthy)")
    for _ in range(3):
        send_telemetry(device_id, token, cpu=12.5, memory=45.2, disk=30.0)
        time.sleep(1.5)
        
    print("\nPhase 2: RANSOMWARE / CPU MINER ATTACK!")
    print("Spiking CPU and Memory IO...")
    for _ in range(5):
        send_telemetry(device_id, token, cpu=99.9, memory=98.5, disk=95.5)
        time.sleep(1.5)
        
    print("\nSimulation Complete. Check your dashboard!")

if __name__ == "__main__":
    main()
