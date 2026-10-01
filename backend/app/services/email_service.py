import smtplib
from email.message import EmailMessage

from mailersend import EmailBuilder, MailerSendClient

from app.core.config import settings


class EmailService:

    @staticmethod
    def send_email(
        to: str,
        subject: str,
        html: str,
        text: str | None = None,
    ) -> None:
        """
        Send a transactional email using the configured provider.
        Supported providers:
        - smtp
        - mailersend
        """

        provider = settings.email_provider.lower().strip()

        if provider == "smtp":
            EmailService._send_via_smtp(
                to=to,
                subject=subject,
                html=html,
                text=text,
            )
            return

        if provider == "mailersend":
            EmailService._send_via_mailersend(
                to=to,
                subject=subject,
                html=html,
                text=text,
            )
            return

        raise RuntimeError(
            f"Unsupported email provider: {settings.email_provider}"
        )

    @staticmethod
    def _send_via_smtp(
        to: str,
        subject: str,
        html: str,
        text: str | None = None,
    ) -> None:
        if not settings.smtp_host:
            raise RuntimeError("SMTP_HOST is not configured.")

        if not settings.smtp_username:
            raise RuntimeError("SMTP_USERNAME is not configured.")

        if not settings.smtp_password:
            raise RuntimeError("SMTP_PASSWORD is not configured.")

        from_email = (
            settings.smtp_from_email
            or settings.smtp_username
        )

        from_name = settings.smtp_from_name

        message = EmailMessage()

        message["Subject"] = subject
        message["From"] = (
            f"{from_name} <{from_email}>"
            if from_name
            else from_email
        )
        message["To"] = to

        plain_text = text or ""
        message.set_content(plain_text)

        message.add_alternative(
            html,
            subtype="html",
        )

        try:
            if settings.smtp_use_tls:
                with smtplib.SMTP(
                    settings.smtp_host,
                    settings.smtp_port,
                    timeout=20,
                ) as server:
                    server.ehlo()
                    server.starttls()
                    server.ehlo()
                    server.login(
                        settings.smtp_username,
                        settings.smtp_password,
                    )
                    server.send_message(message)
            else:
                with smtplib.SMTP_SSL(
                    settings.smtp_host,
                    settings.smtp_port,
                    timeout=20,
                ) as server:
                    server.login(
                        settings.smtp_username,
                        settings.smtp_password,
                    )
                    server.send_message(message)

        except smtplib.SMTPException as exc:
            raise RuntimeError(
                f"SMTP email delivery failed: {exc}"
            ) from exc

    @staticmethod
    def _send_via_mailersend(
        to: str,
        subject: str,
        html: str,
        text: str | None = None,
    ) -> None:
        if not settings.mailersend_api_key:
            raise RuntimeError(
                "MAILERSEND_API_KEY is not configured."
            )

        if not settings.mailersend_from_email:
            raise RuntimeError(
                "MAILERSEND_FROM_EMAIL is not configured."
            )

        client = MailerSendClient(
            api_key=settings.mailersend_api_key
        )

        email = (
            EmailBuilder()
            .from_email(
                settings.mailersend_from_email,
                settings.mailersend_from_name,
            )
            .to_many(
                [
                    {
                        "email": to,
                    }
                ]
            )
            .subject(subject)
            .html(html)
            .text(text or "")
            .build()
        )

        client.emails.send(email)

    @staticmethod
    def send_verification_email(
        to: str,
        verification_url: str,
    ) -> None:
        EmailService.send_email(
            to=to,
            subject="Verify your SentinelTwin AI email",
            html=f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to SentinelTwin AI</h2>

                <p>
                    Thank you for registering.
                    Please verify your email address to activate
                    your SentinelTwin AI account.
                </p>

                <p>
                    <a
                        href="{verification_url}"
                        style="
                            display:inline-block;
                            padding:12px 20px;
                            background:#2563eb;
                            color:white;
                            text-decoration:none;
                            border-radius:6px;
                        "
                    >
                        Verify Email
                    </a>
                </p>

                <p>
                    This verification link expires in 30 minutes.
                </p>

                <p>
                    If you did not create this account, you can safely
                    ignore this email.
                </p>

                <p>
                    SentinelTwin AI Security Team
                </p>
            </div>
            """,
            text=(
                "Welcome to SentinelTwin AI.\n\n"
                "Please verify your email address using this link:\n"
                f"{verification_url}\n\n"
                "This verification link expires in 30 minutes."
            ),
        )

    @staticmethod
    def send_password_reset_email(
        to: str,
        reset_url: str,
    ) -> None:
        EmailService.send_email(
            to=to,
            subject="Reset your SentinelTwin AI password",
            html=f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Password Reset Request</h2>

                <p>
                    We received a request to reset your
                    SentinelTwin AI password.
                </p>

                <p>
                    <a
                        href="{reset_url}"
                        style="
                            display:inline-block;
                            padding:12px 20px;
                            background:#2563eb;
                            color:white;
                            text-decoration:none;
                            border-radius:6px;
                        "
                    >
                        Reset Password
                    </a>
                </p>

                <p>
                    This link expires in 30 minutes.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <p>
                    SentinelTwin AI Security Team
                </p>
            </div>
            """,
            text=(
                "Password Reset Request\n\n"
                "Use the following link to reset your SentinelTwin AI password:\n"
                f"{reset_url}\n\n"
                "This link expires in 30 minutes."
            ),
        )

    @staticmethod
    def send_password_changed_email(
        to: str,
    ) -> None:
        EmailService.send_email(
            to=to,
            subject="Your SentinelTwin AI password was changed",
            html="""
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Password Changed</h2>

                <p>
                    Your SentinelTwin AI password was successfully changed.
                </p>

                <p>
                    If you did not make this change, please contact your
                    security administrator immediately.
                </p>

                <p>
                    SentinelTwin AI Security Team
                </p>
            </div>
            """,
            text=(
                "Your SentinelTwin AI password was successfully changed.\n\n"
                "If you did not make this change, please contact your "
                "security administrator immediately."
            ),
        )