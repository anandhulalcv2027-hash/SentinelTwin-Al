from app.models.permission import Permission

DEFAULT_PERMISSIONS = [
    # Users
    Permission(name="user.create", description="Create users"),
    Permission(name="user.read", description="View users"),
    Permission(name="user.update", description="Update users"),
    Permission(name="user.delete", description="Delete users"),

    # Employees
    Permission(name="employee.create", description="Create employees"),
    Permission(name="employee.read", description="View employees"),
    Permission(name="employee.update", description="Update employees"),
    Permission(name="employee.delete", description="Delete employees"),

    # Devices
    Permission(name="device.create", description="Register devices"),
    Permission(name="device.read", description="View devices"),
    Permission(name="device.update", description="Update devices"),
    Permission(name="device.delete", description="Delete devices"),

    # Authentication / sessions
    Permission(name="auth.read", description="View authentication state"),

    # Organizations
    Permission(name="organization.read", description="View organizations"),
    Permission(name="organization.update", description="Update organizations"),

    # Audit logs
    Permission(name="audit.read", description="View audit logs"),

    # Digital twins
    Permission(name="twin.read", description="View digital twins"),
    Permission(name="twin.update", description="Update digital twins"),
]
