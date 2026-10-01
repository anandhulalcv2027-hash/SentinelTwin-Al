import logging
import os
import re
import sys
import time
from pathlib import Path

import httpx
from dotenv import load_dotenv

from telemetry import collect_telemetry


# ============================================================
# Paths
# ============================================================

# When running normally:
#   BASE_DIR = folder containing heartbeat.py
#
# When running as a PyInstaller executable:
#   BASE_DIR = folder containing SentinelTwinAgent.exe
#
# This ensures that .env and the log file remain beside the
# executable instead of being placed in a temporary folder.
if getattr(sys, "frozen", False):
    BASE_DIR = Path(sys.executable).resolve().parent
else:
    BASE_DIR = Path(__file__).resolve().parent

ENV_FILE = BASE_DIR / ".env"
LOG_FILE = BASE_DIR / "sentineltwin-agent.log"


# ============================================================
# Logging
# ============================================================

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger("sentineltwin-agent")


# ============================================================
# Configuration
# ============================================================

load_dotenv(
    ENV_FILE,
    override=True,
)


API_URL = os.getenv("SENTINELTWIN_API_URL")
DEVICE_ID = os.getenv("DEVICE_ID")
DEVICE_HEARTBEAT_TOKEN = os.getenv(
    "DEVICE_HEARTBEAT_TOKEN"
)
ENROLLMENT_TOKEN = os.getenv(
    "ENROLLMENT_TOKEN"
)

try:
    HEARTBEAT_INTERVAL = int(
        os.getenv(
            "HEARTBEAT_INTERVAL_SECONDS",
            "60",
        )
    )
except ValueError:
    HEARTBEAT_INTERVAL = 60
    logger.warning(
        "Invalid HEARTBEAT_INTERVAL_SECONDS. "
        "Using default value of 60 seconds."
    )


MAX_RETRY_DELAY = 300
INITIAL_RETRY_DELAY = 5


# ============================================================
# Environment File Management
# ============================================================

def save_env_value(
    key: str,
    value: str,
) -> None:
    """
    Create or update a configuration value in the local
    agent .env file.
    """

    try:
        if ENV_FILE.exists():
            content = ENV_FILE.read_text(
                encoding="utf-8"
            )
        else:
            content = ""

        pattern = re.compile(
            rf"(?m)^{re.escape(key)}=.*$"
        )

        replacement = f"{key}={value}"

        if pattern.search(content):
            content = pattern.sub(
                replacement,
                content,
            )
        else:
            if content and not content.endswith("\n"):
                content += "\n"

            content += replacement + "\n"

        ENV_FILE.write_text(
            content,
            encoding="utf-8",
        )

    except OSError as exc:
        logger.error(
            "Failed to update environment file: %s",
            exc,
        )
        raise RuntimeError(
            "Unable to update local agent configuration."
        ) from exc


# ============================================================
# Device Enrollment
# ============================================================

def enroll_device() -> None:
    """
    Redeem the one-time enrollment token and obtain a fresh
    permanent heartbeat credential for this endpoint.
    """

    global DEVICE_ID
    global DEVICE_HEARTBEAT_TOKEN
    global ENROLLMENT_TOKEN

    if not API_URL:
        raise RuntimeError(
            "SENTINELTWIN_API_URL is not configured."
        )

    if not ENROLLMENT_TOKEN:
        raise RuntimeError(
            "ENROLLMENT_TOKEN is not configured."
        )

    url = (
        f"{API_URL}/devices/enroll"
    )

    payload = {
        "enrollment_token": ENROLLMENT_TOKEN,
    }

    logger.info(
        "ENROLLMENT | Registering endpoint."
    )

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(
                url,
                json=payload,
            )

    except httpx.HTTPError as exc:
        logger.error(
            "ENROLLMENT | Network error: %s",
            exc,
        )
        raise RuntimeError(
            "Unable to connect to the SentinelTwin backend."
        ) from exc

    if response.status_code == 200:
        try:
            data = response.json()

            DEVICE_ID = data["device_id"]
            DEVICE_HEARTBEAT_TOKEN = (
                data["heartbeat_token"]
            )

        except (
            ValueError,
            KeyError,
            TypeError,
        ) as exc:
            logger.error(
                "ENROLLMENT | Invalid backend response."
            )
            raise RuntimeError(
                "Invalid enrollment response from backend."
            ) from exc

        # Store permanent device credentials locally.
        save_env_value(
            "DEVICE_ID",
            str(DEVICE_ID),
        )

        save_env_value(
            "DEVICE_HEARTBEAT_TOKEN",
            DEVICE_HEARTBEAT_TOKEN,
        )

        # Consume the one-time enrollment token.
        save_env_value(
            "ENROLLMENT_TOKEN",
            "",
        )

        # Keep the current process environment in sync.
        os.environ["DEVICE_ID"] = str(
            DEVICE_ID
        )

        os.environ[
            "DEVICE_HEARTBEAT_TOKEN"
        ] = DEVICE_HEARTBEAT_TOKEN

        os.environ[
            "ENROLLMENT_TOKEN"
        ] = ""

        logger.info(
            "ENROLLMENT | Device enrolled successfully."
        )

        logger.info(
            "ENROLLMENT | Device ID: %s",
            DEVICE_ID,
        )

        return

    if response.status_code == 400:
        logger.error(
            "ENROLLMENT | Enrollment rejected: %s",
            response.text,
        )
        raise RuntimeError(
            f"Enrollment failed: {response.text}"
        )

    if response.status_code == 403:
        logger.error(
            "ENROLLMENT | Device is inactive."
        )
        raise PermissionError(
            "Enrollment failed because the device "
            "is inactive."
        )

    logger.error(
        "ENROLLMENT | Backend returned HTTP %s.",
        response.status_code,
    )

    raise RuntimeError(
        f"Enrollment failed: "
        f"{response.status_code} "
        f"{response.text}"
    )


def ensure_device_enrolled() -> None:
    """
    Automatically enroll the endpoint when permanent
    device credentials are not available.
    """

    global DEVICE_ID
    global DEVICE_HEARTBEAT_TOKEN

    if (
        DEVICE_ID
        and DEVICE_HEARTBEAT_TOKEN
    ):
        return

    if ENROLLMENT_TOKEN:
        enroll_device()
        return

    raise RuntimeError(
        "Device is not configured. "
        "An ENROLLMENT_TOKEN is required "
        "for first-time setup."
    )


# ============================================================
# Configuration Validation
# ============================================================

def validate_config() -> None:
    """
    Validate all required runtime configuration values.
    """

    missing = []

    if not API_URL:
        missing.append(
            "SENTINELTWIN_API_URL"
        )

    if not DEVICE_ID:
        missing.append(
            "DEVICE_ID"
        )

    if not DEVICE_HEARTBEAT_TOKEN:
        missing.append(
            "DEVICE_HEARTBEAT_TOKEN"
        )

    if missing:
        raise RuntimeError(
            "Missing configuration: "
            + ", ".join(missing)
        )


# ============================================================
# Heartbeat
# ============================================================

def send_heartbeat() -> bool:
    """
    Send an authenticated heartbeat to the backend.
    Returns True if the device is isolated, False otherwise.
    """

    url = (
        f"{API_URL}/devices/"
        f"{DEVICE_ID}/heartbeat"
    )

    if not DEVICE_HEARTBEAT_TOKEN:
        raise RuntimeError(
            "DEVICE_HEARTBEAT_TOKEN is not configured."
        )

    headers = {
        "X-Device-Token": (
            DEVICE_HEARTBEAT_TOKEN
        ),
    }

    try:
        with httpx.Client(
            timeout=10.0
        ) as client:
            response = client.post(
                url,
                headers=headers,
            )

    except httpx.HTTPError as exc:
        raise RuntimeError(
            f"Heartbeat network error: {exc}"
        ) from exc

    if response.status_code == 200:
        try:
            data = response.json()
        except ValueError as exc:
            raise RuntimeError(
                "Heartbeat returned an invalid response."
            ) from exc

        logger.info(
            "HEARTBEAT | %s | last_seen=%s | isolated=%s",
            data["status"],
            data["last_seen"],
            data.get("is_isolated", False),
        )

        return data.get("is_isolated", False)

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


# ============================================================
# Telemetry
# ============================================================

def send_telemetry() -> None:
    """
    Collect local endpoint telemetry and send it to the backend.
    """

    url = (
        f"{API_URL}/devices/"
        f"{DEVICE_ID}/telemetry"
    )

    if not DEVICE_HEARTBEAT_TOKEN:
        raise RuntimeError(
            "DEVICE_HEARTBEAT_TOKEN is not configured."
        )

    headers = {
        "X-Device-Token": (
            DEVICE_HEARTBEAT_TOKEN
        ),
    }

    telemetry = collect_telemetry()

    try:
        with httpx.Client(
            timeout=10.0
        ) as client:
            response = client.post(
                url,
                headers=headers,
                json=telemetry,
            )

    except httpx.HTTPError as exc:
        raise RuntimeError(
            f"Telemetry network error: {exc}"
        ) from exc

    if response.status_code == 201:
        try:
            data = response.json()
        except ValueError as exc:
            raise RuntimeError(
                "Telemetry returned an invalid response."
            ) from exc

        logger.info(
            "TELEMETRY | CPU=%.1f%% | MEM=%.1f%% | DISK=%.1f%%",
            data["cpu_usage_percent"],
            data["memory_usage_percent"],
            data["disk_usage_percent"],
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


# ============================================================
# Main Agent Loop
# ============================================================

def main() -> None:
    """
    Start the SentinelTwin endpoint agent.

    The agent:
    1. Automatically enrolls if required.
    2. Validates configuration.
    3. Sends heartbeat.
    4. Sends telemetry.
    5. Retries temporary failures using exponential backoff.
    """

    retry_delay = INITIAL_RETRY_DELAY

    logger.info(
        "=========================================="
    )
    logger.info(
        "SentinelTwin Endpoint Agent starting."
    )
    logger.info(
        "=========================================="
    )

    try:
        # First-time installation.
        ensure_device_enrolled()

        validate_config()

        logger.info(
            "Device ID: %s",
            DEVICE_ID,
        )

        logger.info(
            "Heartbeat interval: %ss",
            HEARTBEAT_INTERVAL,
        )

        logger.info(
            "Agent initialized successfully."
        )

        while True:
            try:
                is_isolated = send_heartbeat()
                
                if is_isolated:
                    logger.critical(
                        "SECURITY ALERT | Endpoint has been ISOLATED by the backend."
                    )
                    logger.critical(
                        "SECURITY ALERT | Simulating network lockdown and stopping agent."
                    )
                    break
                    
                send_telemetry()

                # Successful communication resets
                # the retry delay.
                retry_delay = INITIAL_RETRY_DELAY

                time.sleep(
                    HEARTBEAT_INTERVAL
                )

            except PermissionError as exc:
                logger.error(
                    "AUTH ERROR | %s",
                    exc,
                )

                logger.error(
                    "Agent stopped because authentication failed."
                )

                break

            except FileNotFoundError as exc:
                logger.error(
                    "DEVICE ERROR | %s",
                    exc,
                )

                logger.error(
                    "Agent stopped because the device "
                    "no longer exists."
                )

                break

            except Exception as exc:
                logger.error(
                    "ERROR | %s",
                    exc,
                )

                logger.warning(
                    "RETRY | Retrying in %s seconds.",
                    retry_delay,
                )

                time.sleep(
                    retry_delay
                )

                retry_delay = min(
                    retry_delay * 2,
                    MAX_RETRY_DELAY,
                )

    except KeyboardInterrupt:
        logger.info(
            "Agent stopped manually."
        )

    except Exception as exc:
        logger.exception(
            "STARTUP ERROR | %s",
            exc,
        )


# ============================================================
# Application Entry Point
# ============================================================

if __name__ == "__main__":
    main()