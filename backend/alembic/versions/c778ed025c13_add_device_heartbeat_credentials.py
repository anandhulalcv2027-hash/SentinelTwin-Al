"""add device heartbeat credentials

Revision ID: c778ed025c13
Revises: 9a442e895556
Create Date: 2026-08-17 15:42:21.885492

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c778ed025c13'
down_revision: Union[str, Sequence[str], None] = '9a442e895556'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "devices",
        sa.Column(
            "heartbeat_token_hash",
            sa.String(length=128),
            nullable=True,
        ),
    )

    op.create_unique_constraint(
        "uq_devices_heartbeat_token_hash",
        "devices",
        ["heartbeat_token_hash"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "uq_devices_heartbeat_token_hash",
        "devices",
        type_="unique",
    )

    op.drop_column(
        "devices",
        "heartbeat_token_hash",
    )