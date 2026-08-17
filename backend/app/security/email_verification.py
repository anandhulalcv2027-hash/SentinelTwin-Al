import hashlib
import secrets


def generate_verification_token() -> str:
    return secrets.token_urlsafe(48)


def hash_verification_token(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()