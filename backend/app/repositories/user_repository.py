from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.role import Role
from app.models.user import User
from app.models.user_role import UserRole


class UserRepository:

    @staticmethod
    def get_user_by_email(
        db: Session,
        email: str,
    ):
        return db.scalar(
            select(User).where(User.email == email)
        )

    @staticmethod
    def get_user_by_username(
        db: Session,
        username: str,
    ):
        return db.scalar(
            select(User).where(User.username == username)
        )

    @staticmethod
    def get_organization_by_slug(
        db: Session,
        slug: str,
    ):
        return db.scalar(
            select(Organization).where(
                Organization.slug == slug
            )
        )

    @staticmethod
    def get_role_by_name(
        db: Session,
        role_name: str,
    ):
        return db.scalar(
            select(Role).where(
                Role.name == role_name
            )
        )

    @staticmethod
    def create_organization(
        db: Session,
        organization: Organization,
    ):
        db.add(organization)
        db.flush()
        return organization

    @staticmethod
    def create_user(
        db: Session,
        user: User,
    ):
        db.add(user)
        db.flush()
        return user

    @staticmethod
    def assign_role(
        db: Session,
        user_role: UserRole,
    ):
        db.add(user_role)
        db.flush()

    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
    ):
        return db.scalar(
            select(User).where(
                User.email == email
            )
        )
    @staticmethod
    def get_user_by_id(
    db: Session,
        user_id: str,
    ):
        return db.scalar(
            select(User).where(
                User.id == user_id
            )
        )    