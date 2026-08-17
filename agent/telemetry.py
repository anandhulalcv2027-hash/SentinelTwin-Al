import platform
import socket
import time

import psutil


AGENT_VERSION = "0.1.0"


def collect_telemetry() -> dict:
    """
    Collect local endpoint telemetry.

    This function only reads system information.
    It does not communicate with the SentinelTwin backend.
    """

    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    boot_time = psutil.boot_time()
    uptime_seconds = int(time.time() - boot_time)

    return {
        "hostname": socket.gethostname(),
        "operating_system": platform.system(),
        "os_version": platform.version(),
        "cpu_usage_percent": psutil.cpu_percent(
            interval=1
        ),
        "memory_usage_percent": memory.percent,
        "disk_usage_percent": disk.percent,
        "uptime_seconds": uptime_seconds,
        "agent_version": AGENT_VERSION,
    }


if __name__ == "__main__":
    telemetry = collect_telemetry()

    for key, value in telemetry.items():
        print(f"{key}: {value}")