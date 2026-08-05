from app.models.role import Role

DEFAULT_ROLES = [
    Role(
        name="Admin",
        description="Full system access",
    ),
    Role(
        name="Security Analyst",
        description="Monitors security events and threats",
    ),
    Role(
        name="Employee",
        description="Standard employee account",
    ),
]