import hashlib
import secrets


def generate_heartbeat_token() -> str:
    return secrets.token_urlsafe(48)


def hash_heartbeat_token(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


def verify_heartbeat_token(
    token: str,
    token_hash: str,
) -> bool:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest() == token_hash