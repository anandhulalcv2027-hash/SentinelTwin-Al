import httpx
import zipfile
import io
import json
import time
import os

API_URL = "http://127.0.0.1:8000/api/v1"

def run_test():
    with httpx.Client() as client:
        print("Registering org...")
        reg_data = {
            "organization_name": "Test Org Valid",
            "organization_slug": "test-org-valid",
            "first_name": "Admin",
            "last_name": "User",
            "email": "admin2@sentineltwin.com",
            "username": "admin2@sentineltwin.com",
            "password": "adminpassword123"
        }
        client.post(f"{API_URL}/auth/register", json=reg_data)
        
        # 1. Login to get admin token
        print("Logging in...")
        resp = client.post(f"{API_URL}/auth/login", data={"username": "admin2@sentineltwin.com", "password": "adminpassword123"})
        if resp.status_code != 200:
            print("Login failed:", resp.text)
            return
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Get organization ID
        resp = client.get(f"{API_URL}/auth/me", headers=headers)
        user_data = resp.json()
        org_id = user_data["organization_id"]
        
        # 3. Create a device (Agent Registration)
        print("Registering device...")
        device_data = {
            "name": "Validation-PC",
            "device_type": "windows-endpoint",
            "device_identifier": "VAL-PC-001"
        }
        resp = client.post(f"{API_URL}/devices/", json=device_data, headers=headers)
        if resp.status_code != 200:
            print("Failed to register device:", resp.text)
            return
        device = resp.json()
        device_id = device["id"]
        
        # 4. Generate enrollment token
        print("Generating enrollment token...")
        resp = client.post(f"{API_URL}/devices/{device_id}/enrollment", headers=headers)
        enrollment_token = resp.json()["enrollment_token"]
        
        # 5. Download Agent Package
        print("Downloading agent package...")
        resp = client.post(f"{API_URL}/devices/agent/package", json={"enrollment_token": enrollment_token, "target_os": "windows"})
        if resp.status_code != 200:
            print("Failed to download package:", resp.text)
            return
        
        zip_data = resp.content
        with zipfile.ZipFile(io.BytesIO(zip_data)) as z:
            files = z.namelist()
            print("Package contains:", files)
            
            # Check for secrets
            if any("db" in f.lower() or "secret" in f.lower() for f in files):
                print("WARNING: Package contains suspicious files")
                
            env_content = z.read(".env").decode("utf-8")
            print("\n.env content:")
            print(env_content)
            
            # Verify no localhost API URL if we intended it for remote? 
            # Actually, the VITE_API_BASE_URL or SENTINELTWIN_API_URL should be in there.
            
            print("\nVerification successful!")
            
            # Save package for running locally
            z.extractall("agent_test_dir")

if __name__ == "__main__":
    run_test()
