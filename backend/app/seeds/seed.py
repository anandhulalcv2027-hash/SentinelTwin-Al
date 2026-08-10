from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.permission import Permission
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.seeds.permissions import DEFAULT_PERMISSIONS
from app.seeds.roles import DEFAULT_ROLES


def seed_roles(db: Session):
    for role in DEFAULT_ROLES:
        existing = db.scalar(
            select(Role).where(Role.name == role.name)
        )

        if existing is None:
            db.add(role)

    db.commit()


def seed_permissions(db: Session):
    for permission in DEFAULT_PERMISSIONS:
        existing = db.scalar(
            select(Permission).where(
                Permission.name == permission.name
            )
        )

        if existing is None:
            db.add(permission)

    db.commit()


def seed_admin_permissions(db: Session):
    permissions = db.scalars(
        select(Permission)
    ).all()

    admin_roles = db.scalars(
        select(Role).where(
            Role.name.in_(
                [
                    "System Administrator",
                    "Organization Administrator",
                    "Admin",
                ]
            )
        )
    ).all()

    for admin in admin_roles:
        for permission in permissions:

            exists = db.scalar(
                select(RolePermission).where(
                    RolePermission.role_id == admin.id,
                    RolePermission.permission_id == permission.id,
                )
            )

            if exists is None:
                db.add(
                    RolePermission(
                        role_id=admin.id,
                        permission_id=permission.id,
                    )
                )

    db.commit()


def seed():
    db = SessionLocal()

    try:
        seed_roles(db)
        seed_permissions(db)
        seed_admin_permissions(db)

        print("Database seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
