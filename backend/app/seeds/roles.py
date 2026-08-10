from app.models.role import Role

DEFAULT_ROLES = [
    Role(
        name="System Administrator",
        description="Platform-wide administrative access",
    ),
    Role(
        name="Organization Administrator",
        description="Full administrative access inside one organization",
    ),
    Role(
        name="Security Analyst",
        description="Monitors security events and threats",
    ),
    Role(
        name="Employee",
        description="Standard employee account",
    ),
    Role(
        name="Endpoint Agent",
        description="Machine identity used by endpoint agents",
    ),
]
