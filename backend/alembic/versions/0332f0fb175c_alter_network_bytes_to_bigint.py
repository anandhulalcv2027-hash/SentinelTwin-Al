"""alter_network_bytes_to_bigint

Revision ID: 0332f0fb175c
Revises: 3498dfe85307
Create Date: 2026-10-22 23:30:35.222030

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0332f0fb175c'
down_revision: Union[str, Sequence[str], None] = '3498dfe85307'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        'device_telemetry',
        'network_bytes_sent',
        existing_type=sa.Integer(),
        type_=sa.BigInteger(),
        existing_nullable=False,
    )
    op.alter_column(
        'device_telemetry',
        'network_bytes_recv',
        existing_type=sa.Integer(),
        type_=sa.BigInteger(),
        existing_nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        'device_telemetry',
        'network_bytes_sent',
        existing_type=sa.BigInteger(),
        type_=sa.Integer(),
        existing_nullable=False,
    )
    op.alter_column(
        'device_telemetry',
        'network_bytes_recv',
        existing_type=sa.BigInteger(),
        type_=sa.Integer(),
        existing_nullable=False,
    )
