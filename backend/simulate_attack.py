import os
import sys
import subprocess

# Auto-detect project virtual environment and re-exec if running under global python
script_dir = os.path.dirname(os.path.abspath(__file__))
venv_python = os.path.join(script_dir, ".venv", "Scripts", "python.exe")
if os.path.exists(venv_python) and os.path.normcase(sys.executable) != os.path.normcase(venv_python):
    result = subprocess.run([venv_python] + sys.argv)
    sys.exit(result.returncode)

import time
import uuid
import requests
from datetime import datetime
from uuid import UUID

from app.db.session import SessionLocal
from app.models.device import Device
from app.models.user import User
from app.models.organization import Organization
from app.security.device_heartbeat import hash_heartbeat_token

API_BASE_URL = "http://localhost:8000/api/v1"

def setup_simulation_device():
    """
    Finds or creates a dedicated simulation device so that your real agent
    tokens are not disturbed, ensuring it belongs to your active organization.
    """
    db = SessionLocal()
    try:
        # Determine active organization (prioritize logged-in user or active devices)
        target_org_id = None
        user = db.query(User).filter(User.email == "cvanandhulal790@gmail.com").first()
        if user and user.organization_id:
            target_org_id = user.organization_id
        else:
            active_device = db.query(Device).filter(Device.name != "Simulated-Victim-Endpoint").first()
            if active_device and active_device.organization_id:
                target_org_id = active_device.organization_id
            else:
                first_org = db.query(Organization).first()
                if first_org:
                    target_org_id = first_org.id

        if not target_org_id:
            print("[-] Error: No Organization found in database.")
            return None, None

        # Check if a simulation device already exists
        device = db.query(Device).filter(Device.device_identifier == "simulated-victim-01").first()
        
        known_token = "sentineltwin_sim_secret_token_12345"
        
        if not device:
            device = Device(
                organization_id=target_org_id,
                name="Simulated-Victim-Endpoint",
                device_identifier="simulated-victim-01",
                description="Dedicated target for security attack simulations",
                device_type="endpoint",
                is_active=True,
                heartbeat_token_hash=hash_heartbeat_token(known_token),
                last_seen=datetime.utcnow()
            )
            db.add(device)
            db.commit()
            db.refresh(device)
            print(f"[+] Created dedicated simulation device: {device.name} ({device.id})")
        else:
            # Ensure known token hash is set and assigned to active org
            device.organization_id = target_org_id
            device.heartbeat_token_hash = hash_heartbeat_token(known_token)
            device.is_active = True
            db.commit()
            print(f"[+] Using simulation device: {device.name} ({device.id}) [Org: {target_org_id}]")
            
        return str(device.id), known_token
    finally:
        db.close()

def send_telemetry(device_id: str, token: str, **kwargs):
    url = f"{API_BASE_URL}/devices/{device_id}/telemetry"
    headers = {
        "X-Device-Token": token,
        "Content-Type": "application/json"
    }
    
    payload = {
        "hostname": "simulated-victim",
        "operating_system": "Windows 11",
        "os_version": "10.0.22621",
        "cpu_usage_percent": kwargs.get("cpu", 15.0),
        "memory_usage_percent": kwargs.get("memory", 45.0),
        "disk_usage_percent": kwargs.get("disk", 50.0),
        "uptime_seconds": 36000,
        "network_bytes_sent": kwargs.get("net_sent", 500000),
        "network_bytes_recv": kwargs.get("net_recv", 1000000),
        "active_connections": kwargs.get("active_connections", 25),
        "process_count": kwargs.get("process_count", 120),
        "failed_logins": kwargs.get("failed_logins", 0),
        "agent_version": "1.0.0"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code == 201:
            data = response.json()
            print(f"  [>] Telemetry sent: CPU={payload['cpu_usage_percent']}% | RAM={payload['memory_usage_percent']}% | OutNet={payload['network_bytes_sent'] // 1024}KB | FailedLogins={payload['failed_logins']}")
        else:
            print(f"  [!] Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"  [!] Connection error: {e}")

def simulate_healthy_baseline(device_id: str, token: str):
    print("\n--- PHASE 1: Baseline Normal Telemetry (3 samples) ---")
    for _ in range(3):
        send_telemetry(device_id, token, cpu=12.5, memory=42.0, disk=45.0, net_sent=250000, net_recv=500000, active_connections=20, failed_logins=0)
        time.sleep(2)

def simulate_passive_exfiltration(device_id: str, token: str):
    print("\n--- PHASE 2: PASSIVE ATTACK: Stealth Data Exfiltration & Network Scanning ---")
    print("Simulating stealth port scanning and covert 250MB outbound data exfiltration...")
    for i in range(4):
        send_telemetry(
            device_id, token,
            cpu=22.0, # Normal CPU so it evades traditional threshold alerts
            memory=52.0,
            disk=48.0,
            net_sent=150000000 + (i * 25000000), # 150MB+ outgoing traffic (exfiltration!)
            net_recv=10000000,
            active_connections=185, # anomalous spike in remote sockets
            failed_logins=0
        )
        time.sleep(2)

def simulate_passive_bruteforce(device_id: str, token: str):
    print("\n--- PHASE 3: PASSIVE ATTACK: Credential Stuffing / Brute-Force ---")
    print("Simulating multiple failed authentication attempts...")
    for i in range(3):
        send_telemetry(
            device_id, token,
            cpu=18.0,
            memory=48.0,
            disk=46.0,
            net_sent=500000,
            net_recv=800000,
            active_connections=45,
            failed_logins=12 + (i * 4) # High failed logins trigger
        )
        time.sleep(2)

def simulate_active_ransomware(device_id: str, token: str):
    print("\n--- PHASE 4: ACTIVE ATTACK: High-Intensity Ransomware / Miner ---")
    print("Simulating high CPU and Memory encryption activity...")
    for _ in range(3):
        send_telemetry(
            device_id, token,
            cpu=98.5,
            memory=94.0,
            disk=92.0,
            net_sent=80000000,
            net_recv=20000000,
            active_connections=90,
            failed_logins=0
        )
        time.sleep(2)

def main():
    print("==================================================")
    print("      SentinelTwin AI - Attack Simulator          ")
    print("==================================================")
    device_id, token = setup_simulation_device()
    if not device_id:
        return

    print("\nSelect simulation mode:")
    print("1. Run Passive Attacks (Data Exfiltration & Brute-Force)")
    print("2. Run Active Attack (Ransomware / Cryptominer)")
    print("3. Run Full Simulation (Baseline -> Passive Attacks -> Active Attack)")
    
    choice = input("\nEnter choice [1, 2, or 3] (default 3): ").strip()
    if not choice:
        choice = "3"
        
    if choice == "1":
        simulate_healthy_baseline(device_id, token)
        simulate_passive_exfiltration(device_id, token)
        simulate_passive_bruteforce(device_id, token)
    elif choice == "2":
        simulate_healthy_baseline(device_id, token)
        simulate_active_ransomware(device_id, token)
    else:
        simulate_healthy_baseline(device_id, token)
        simulate_passive_exfiltration(device_id, token)
        simulate_passive_bruteforce(device_id, token)
        simulate_active_ransomware(device_id, token)

    print("\n==================================================")
    print("Simulation complete!")
    print("Open your SentinelTwin AI Dashboard to review:")
    print(" - SOC Wall: Check real-time threat feed and twin glow")
    print(" - Incidents: Check generated security incidents")
    print(" - Alerts: Check triggered security alerts")
    print(" - Topology: Check connections to external nodes")
    print("==================================================")

if __name__ == "__main__":
    main()
