from datetime import timezone
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.models.email_verification_token import EmailVerificationToken
from app.models.organization import Organization
from app.models.password_reset_token import PasswordResetToken
from app.models.permission import Permission
from app.models.refresh_token import RefreshToken
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.user import User
from app.models.user_role import UserRole


class UserRepository:

    @staticmethod
    def get_user_by_email(
        db: Session,
        email: str,
    ):
        return db.scalar(
            select(User).where(
                User.email == email
            )
        )

    @staticmethod
    def get_user_by_username(
        db: Session,
        username: str,
    ):
        return db.scalar(
            select(User).where(
                User.username == username
            )
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
    def get_all_roles(
        db: Session,
    ) -> list[Role]:
        return list(
            db.scalars(
                select(Role)
                .order_by(Role.name.asc())
            ).all()
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
    
    @staticmethod
    def get_all_users(db: Session) -> list[User]:
        return list(
            db.scalars(
                select(User).order_by(User.created_at.desc())
            ).all()
        )

    # ------------------------------------------------------------------
    # Organization-scoped user management
    # ------------------------------------------------------------------

    @staticmethod
    def get_users_by_organization(
        db: Session,
        organization_id,
    ) -> list[User]:
        return list(
            db.scalars(
                select(User)
                .where(
                    User.organization_id == organization_id
                )
                .order_by(User.created_at.desc())
            ).all()
        )

    @staticmethod
    def get_user_by_id_in_organization(
        db: Session,
        user_id,
        organization_id,
    ) -> User | None:
        return db.scalar(
            select(User).where(
                User.id == user_id,
                User.organization_id == organization_id,
            )
        )

    @staticmethod
    def get_user_by_email_in_organization(
        db: Session,
        email: str,
        organization_id,
    ) -> User | None:
        return db.scalar(
            select(User).where(
                User.email == email,
                User.organization_id == organization_id,
            )
        )

    @staticmethod
    def get_user_by_username_in_organization(
        db: Session,
        username: str,
        organization_id,
    ) -> User | None:
        return db.scalar(
            select(User).where(
                User.username == username,
                User.organization_id == organization_id,
            )
        )

    @staticmethod
    def get_role_by_id(
        db: Session,
        role_id,
    ) -> Role | None:
        return db.scalar(
            select(Role).where(
                Role.id == role_id
            )
        )

    @staticmethod
    def get_user_role(
        db: Session,
        user_id,
    ) -> UserRole | None:
        return db.scalar(
            select(UserRole).where(
                UserRole.user_id == user_id
            )
        )

    @staticmethod
    def update_user(
        db: Session,
        user: User,
    ) -> User:
        db.add(user)
        db.flush()
        return user

    @staticmethod
    def remove_user_role(
        db: Session,
        user_role: UserRole,
    ) -> None:
        db.delete(user_role)
        db.flush()

    # ------------------------------------------------------------------
    # RBAC
    # ------------------------------------------------------------------

    @staticmethod
    def get_user_role_names(
        db: Session,
        user_id: str,
    ) -> list[str]:
        return list(
            db.scalars(
                select(Role.name)
                .join(
                    UserRole,
                    UserRole.role_id == Role.id,
                )
                .where(
                    UserRole.user_id == user_id
                )
            ).all()
        )

    @staticmethod
    def user_has_permission(
        db: Session,
        user_id: str,
        permission_name: str,
    ) -> bool:
        permission = db.scalar(
            select(Permission.id)
            .join(
                RolePermission,
                RolePermission.permission_id == Permission.id,
            )
            .join(
                UserRole,
                UserRole.role_id == RolePermission.role_id,
            )
            .where(
                UserRole.user_id == user_id,
                Permission.name == permission_name,
            )
        )

        return permission is not None

    # ------------------------------------------------------------------
    # Refresh tokens
    # ------------------------------------------------------------------

    @staticmethod
    def create_refresh_token(
        db: Session,
        refresh_token: RefreshToken,
    ) -> RefreshToken:
        db.add(refresh_token)
        db.flush()
        return refresh_token

    @staticmethod
    def get_refresh_token_by_hash(
        db: Session,
        token_hash: str,
    ) -> RefreshToken | None:
        return db.scalar(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash
            )
        )

    # ------------------------------------------------------------------
    # Password reset
    # ------------------------------------------------------------------

    @staticmethod
    def create_password_reset_token(
        db: Session,
        reset_token: PasswordResetToken,
    ) -> PasswordResetToken:
        db.add(reset_token)
        db.flush()
        return reset_token

    @staticmethod
    def get_password_reset_token_by_hash(
        db: Session,
        token_hash: str,
    ) -> PasswordResetToken | None:
        return db.scalar(
            select(PasswordResetToken).where(
                PasswordResetToken.token_hash == token_hash
            )
        )

    # ------------------------------------------------------------------
    # Audit logs
    # ------------------------------------------------------------------

    @staticmethod
    def create_audit_log(
        db: Session,
        audit_log: AuditLog,
    ) -> AuditLog:
        db.add(audit_log)
        db.flush()
        return audit_log

    @staticmethod
    def revoke_all_refresh_tokens(
        db: Session,
        user_id,
    ):
        tokens = db.scalars(
            select(RefreshToken).where(
                RefreshToken.user_id == user_id,
                RefreshToken.revoked_at.is_(None),
            )
        ).all()

        for token in tokens:
            token.revoked_at = datetime.now(timezone.utc)

        return tokens

    # ------------------------------------------------------------------
    # Email verification
    # ------------------------------------------------------------------

    @staticmethod
    def create_email_verification_token(
        db: Session,
        verification_token: EmailVerificationToken,
    ) -> EmailVerificationToken:
        db.add(verification_token)
        db.flush()
        return verification_token

    @staticmethod
    def get_email_verification_token_by_hash(
        db: Session,
        token_hash: str,
    ) -> EmailVerificationToken | None:
        return db.scalar(
            select(EmailVerificationToken).where(
                EmailVerificationToken.token_hash == token_hash
            )
        )