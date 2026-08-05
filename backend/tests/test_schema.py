from app.schemas.auth import RegisterRequest

user = RegisterRequest(
    organization_name="SentinelTwin",
    organization_slug="sentineltwin",
    username="admin",
    email="admin@sentineltwin.ai",
    password="Password123!",
    first_name="Admin",
    last_name="User",
)

print(user)