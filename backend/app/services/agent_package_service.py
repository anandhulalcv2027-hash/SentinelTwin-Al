import io
import zipfile
from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.device import Device
from app.models.device_enrollment_token import DeviceEnrollmentToken
from app.security.device_enrollment import (
    generate_enrollment_token,
    hash_enrollment_token,
)


class AgentPackageService:

    @staticmethod
    def create_package(
        db: Session,
        device: Device,
    ) -> bytes:

        project_root = Path(__file__).resolve().parents[3]

        agent_exe = (
            project_root
            / "agent"
            / "dist"
            / "SentinelTwinAgent.exe"
        )

        installer_bat = (
            project_root
            / "agent"
            / "Install-SentinelTwin.bat"
        )

        if not agent_exe.exists():
            raise FileNotFoundError(
                "SentinelTwinAgent.exe was not found. "
                "Build the agent executable first."
            )

        if not installer_bat.exists():
            raise FileNotFoundError(
                "Install-SentinelTwin.bat was not found."
            )

        # Invalidate previous unused enrollment tokens.
        existing_tokens = (
            db.query(DeviceEnrollmentToken)
            .filter(
                DeviceEnrollmentToken.device_id == device.id,
                DeviceEnrollmentToken.used_at.is_(None),
            )
            .all()
        )

        now = datetime.utcnow()

        for token in existing_tokens:
            token.used_at = now

        # Create a fresh one-time enrollment token.
        enrollment_token = generate_enrollment_token()

        enrollment = DeviceEnrollmentToken(
            device_id=device.id,
            token_hash=hash_enrollment_token(
                enrollment_token
            ),
            expires_at=now + timedelta(minutes=30),
        )

        db.add(enrollment)
        db.commit()

        env_content = (
            f"SENTINELTWIN_API_URL="
            f"{settings.public_api_url.rstrip('/')}/api/v1\n"
            "\n"
            "DEVICE_ID=\n"
            "DEVICE_HEARTBEAT_TOKEN=\n"
            f"ENROLLMENT_TOKEN={enrollment_token}\n"
            "\n"
            "HEARTBEAT_INTERVAL_SECONDS=60\n"
        )

        package_buffer = io.BytesIO()

        with zipfile.ZipFile(
            package_buffer,
            mode="w",
            compression=zipfile.ZIP_DEFLATED,
        ) as package:

            package.writestr(
                "SentinelTwinAgent.exe",
                agent_exe.read_bytes(),
            )

            package.writestr(
                "Install-SentinelTwin.bat",
                installer_bat.read_text(
                    encoding="utf-8"
                ),
            )

            package.writestr(
                ".env",
                env_content,
            )

            package.writestr(
                "README.txt",
                (
                    "SentinelTwin AI Endpoint Agent\n"
                    "================================\n\n"
                    "Installation:\n"
                    "1. Extract all files into the same folder.\n"
                    "2. Double-click Install-SentinelTwin.bat.\n"
                    "3. The agent will automatically enroll "
                    "this endpoint.\n"
                    "4. Monitoring will start automatically.\n\n"
                    "The enrollment credential is one-time use "
                    "and expires after 30 minutes.\n"
                ),
            )

        package_buffer.seek(0)

        return package_buffer.getvalue()