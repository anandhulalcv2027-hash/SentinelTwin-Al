"""rename legacy admin role

Revision ID: 9a442e895556
Revises: ef8f3c0a677a
Create Date: 2026-08-17 09:49:01.765384

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9a442e895556"
down_revision: Union[str, Sequence[str], None] = "ef8f3c0a677a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Rename the legacy Admin role to Organization Administrator."""

    connection = op.get_bind()

    existing_organization_admin = connection.execute(
        sa.text(
            """
            SELECT id
            FROM roles
            WHERE name = :name
            """
        ),
        {"name": "Organization Administrator"},
    ).fetchone()

    if existing_organization_admin is not None:
        return

    connection.execute(
        sa.text(
            """
            UPDATE roles
            SET
                name = :new_name,
                description = :description
            WHERE name = :old_name
            """
        ),
        {
            "old_name": "Admin",
            "new_name": "Organization Administrator",
            "description": "Full administrative access inside one organization",
        },
    )


def downgrade() -> None:
    """Restore the legacy Admin role name."""

    connection = op.get_bind()

    connection.execute(
        sa.text(
            """
            UPDATE roles
            SET
                name = :old_name
            WHERE name = :new_name
            """
        ),
        {
            "old_name": "Admin",
            "new_name": "Organization Administrator",
        },
    )