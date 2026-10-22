import platform
import subprocess

def collect_firewall_state() -> bool | None:
    if platform.system() == "Windows":
        try:
            result = subprocess.run(
                ["netsh", "advfirewall", "show", "allprofiles", "state"],
                capture_output=True,
                text=True,
                timeout=5
            )
            # If any profile is ON, we might consider it enabled, or just check if all are off
            if "ON" in result.stdout:
                return True
            if "OFF" in result.stdout:
                return False
        except Exception:
            pass
    elif platform.system() == "Linux":
        try:
            result = subprocess.run(["ufw", "status"], capture_output=True, text=True, timeout=5)
            if "Status: active" in result.stdout:
                return True
            if "Status: inactive" in result.stdout:
                return False
        except Exception:
            pass
    return None
