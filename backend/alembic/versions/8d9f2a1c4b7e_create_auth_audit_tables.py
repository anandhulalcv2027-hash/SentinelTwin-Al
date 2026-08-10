"""create_auth_audit_tables

Revision ID: 8d9f2a1c4b7e
Revises: b26a52a494b6
Create Date: 2026-08-06 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8d9f2a1c4b7e"
down_revision: Union[str, Sequence[str], None] = "b26a52a494b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("token_hash", sa.Text(), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("revoked_at", sa.DateTime(), nullable=True),
        sa.Column("created_by_ip", sa.String(length=64), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token_hash"),
    )
    op.create_index(
        "idx_refresh_tokens_hash",
        "refresh_tokens",
        ["token_hash"],
        unique=False,
    )
    op.create_index(
        "idx_refresh_tokens_user",
        "refresh_tokens",
        ["user_id"],
        unique=False,
    )

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("organization_id", sa.UUID(), nullable=True),
        sa.Column("actor_user_id", sa.UUID(), nullable=True),
        sa.Column("action", sa.String(length=120), nullable=False),
        sa.Column("resource_type", sa.String(length=120), nullable=True),
        sa.Column("resource_id", sa.String(length=120), nullable=True),
        sa.Column("ip_address", sa.String(length=64), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("details", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["actor_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "idx_audit_logs_action",
        "audit_logs",
        ["action"],
        unique=False,
    )
    op.create_index(
        "idx_audit_logs_actor",
        "audit_logs",
        ["actor_user_id"],
        unique=False,
    )
    op.create_index(
        "idx_audit_logs_created",
        "audit_logs",
        ["created_at"],
        unique=False,
    )
    op.create_index(
        "idx_audit_logs_organization",
        "audit_logs",
        ["organization_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("idx_audit_logs_organization", table_name="audit_logs")
    op.drop_index("idx_audit_logs_created", table_name="audit_logs")
    op.drop_index("idx_audit_logs_actor", table_name="audit_logs")
    op.drop_index("idx_audit_logs_action", table_name="audit_logs")
    op.drop_table("audit_logs")
    op.drop_index("idx_refresh_tokens_user", table_name="refresh_tokens")
    op.drop_index("idx_refresh_tokens_hash", table_name="refresh_tokens")
    op.drop_table("refresh_tokens")
