import httpx

API_URL = "http://localhost:8000/api/v1"
ENROLLMENT_TOKEN = "zaDdX2tAHNdgXHwvqUusOKVkljQLGHN5_QvQ4yk5C68"

# 1. Enroll
print("Enrolling...")
resp1 = httpx.post(f"{API_URL}/devices/enroll", json={"enrollment_token": ENROLLMENT_TOKEN})
print(f"Enroll status: {resp1.status_code}")
print(f"Enroll response: {resp1.text}")

if resp1.status_code == 200:
    data = resp1.json()
    device_id = data["device_id"]
    heartbeat_token = data["heartbeat_token"]

    # 2. Heartbeat
    print(f"\nHeartbeating for {device_id}...")
    headers = {"X-Device-Token": heartbeat_token}
    resp2 = httpx.post(f"{API_URL}/devices/{device_id}/heartbeat", headers=headers)
    print(f"Heartbeat status: {resp2.status_code}")
    print(f"Heartbeat response: {resp2.text}")
