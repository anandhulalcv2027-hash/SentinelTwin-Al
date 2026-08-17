import os
import time

import httpx
from dotenv import load_dotenv
from telemetry import collect_telemetry

load_dotenv()

API_URL = os.getenv("SENTINELTWIN_API_URL")
DEVICE_ID = os.getenv("DEVICE_ID")
DEVICE_HEARTBEAT_TOKEN = os.getenv("DEVICE_HEARTBEAT_TOKEN")
HEARTBEAT_INTERVAL = int(
    os.getenv("HEARTBEAT_INTERVAL_SECONDS", "60")
)

MAX_RETRY_DELAY = 300
INITIAL_RETRY_DELAY = 5


def validate_config() -> None:
    missing = []

    if not API_URL:
        missing.append("SENTINELTWIN_API_URL")

    if not DEVICE_ID:
        missing.append("DEVICE_ID")

    if not DEVICE_HEARTBEAT_TOKEN:
        missing.append("DEVICE_HEARTBEAT_TOKEN")

    if missing:
        raise RuntimeError(
            f"Missing configuration: {', '.join(missing)}"
        )


def send_heartbeat() -> None:
    url = (
        f"{API_URL}/devices/"
        f"{DEVICE_ID}/heartbeat"
    )

    if not DEVICE_HEARTBEAT_TOKEN:
        raise RuntimeError(
            "DEVICE_HEARTBEAT_TOKEN is not configured."
        )

    headers = {
        "X-Device-Token": DEVICE_HEARTBEAT_TOKEN,
    }

    with httpx.Client(timeout=10.0) as client:
        response = client.post(
            url,
            headers=headers,
        )

    if response.status_code == 200:
        data = response.json()

        print(
            f"[HEARTBEAT] {data['status']} | "
            f"last_seen={data['last_seen']}"
        )
        return

    if response.status_code == 401:
        raise PermissionError(
            "Heartbeat authentication failed. "
            "The device token is invalid."
        )

    if response.status_code == 404:
        raise FileNotFoundError(
            "Device was not found."
        )

    raise RuntimeError(
        f"Heartbeat failed: "
        f"{response.status_code} "
        f"{response.text}"
    )


def send_telemetry() -> None:
    url = (
        f"{API_URL}/devices/"
        f"{DEVICE_ID}/telemetry"
    )

    if not DEVICE_HEARTBEAT_TOKEN:
        raise RuntimeError(
            "DEVICE_HEARTBEAT_TOKEN is not configured."
        )

    headers = {
        "X-Device-Token": DEVICE_HEARTBEAT_TOKEN,
    }

    telemetry = collect_telemetry()

    with httpx.Client(timeout=10.0) as client:
        response = client.post(
            url,
            headers=headers,
            json=telemetry,
        )

    if response.status_code == 201:
        data = response.json()

        print(
            f"[TELEMETRY] "
            f"CPU={data['cpu_usage_percent']:.1f}% | "
            f"MEM={data['memory_usage_percent']:.1f}% | "
            f"DISK={data['disk_usage_percent']:.1f}%"
        )
        return

    if response.status_code == 401:
        raise PermissionError(
            "Telemetry authentication failed."
        )

    if response.status_code == 404:
        raise FileNotFoundError(
            "Device was not found."
        )

    raise RuntimeError(
        f"Telemetry failed: "
        f"{response.status_code} "
        f"{response.text}"
    )


def main() -> None:
    validate_config()

    retry_delay = INITIAL_RETRY_DELAY

    print("SentinelTwin Endpoint Agent")
    print(f"Device ID: {DEVICE_ID}")
    print(
        f"Heartbeat interval: "
        f"{HEARTBEAT_INTERVAL}s"
    )

    try:
        while True:
            try:
                send_heartbeat()
                send_telemetry()

                # Heartbeat and telemetry succeeded,
                # so reset the retry delay.
                retry_delay = INITIAL_RETRY_DELAY

                time.sleep(HEARTBEAT_INTERVAL)

            except PermissionError as exc:
                print(f"[AUTH ERROR] {exc}")
                print(
                    "Agent stopped. "
                    "Reconfigure the device heartbeat token."
                )
                break

            except FileNotFoundError as exc:
                print(f"[DEVICE ERROR] {exc}")
                print(
                    "Agent stopped. "
                    "The configured device no longer exists."
                )
                break

            except Exception as exc:
                print(f"[ERROR] {exc}")
                print(
                    f"[RETRY] Retrying in "
                    f"{retry_delay} seconds..."
                )

                time.sleep(retry_delay)

                retry_delay = min(
                    retry_delay * 2,
                    MAX_RETRY_DELAY,
                )

    except KeyboardInterrupt:
        print("\nSentinelTwin Endpoint Agent stopped.")


if __name__ == "__main__":
    main()