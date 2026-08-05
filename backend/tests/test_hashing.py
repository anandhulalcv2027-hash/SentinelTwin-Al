from app.security.hashing import (
    hash_password,
    verify_password,
)

password = "SentinelTwin123!"

hashed = hash_password(password)

print("Password :", password)
print("Hash :", hashed)

print("Verification :", verify_password(password, hashed))