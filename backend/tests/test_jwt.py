from app.security.jwt import (
    create_access_token,
    verify_access_token,
)

token = create_access_token(
    {
        "sub": "admin@sentineltwin.ai",
        "user_id": "12345",
    }
)

print("TOKEN")
print(token)

print()

payload = verify_access_token(token)

print("PAYLOAD")

print(payload)