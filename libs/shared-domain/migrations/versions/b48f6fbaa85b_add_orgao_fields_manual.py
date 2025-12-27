"""add_orgao_fields_manual

Revision ID: b48f6fbaa85b
Revises: feecfceab78a
Create Date: 2026-01-02 18:43:26.999664

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b48f6fbaa85b"
down_revision: Union[str, Sequence[str], None] = "feecfceab78a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Rename 'tipo' to 'tipo_orgao'
    op.alter_column("orgaos", "tipo", new_column_name="tipo_orgao")

    # Add new columns
    op.add_column("orgaos", sa.Column("nome_publicacao", sa.String(), nullable=True))
    op.add_column("orgaos", sa.Column("cod_tipo_orgao", sa.Integer(), nullable=True))
    op.add_column("orgaos", sa.Column("data_inicio", sa.Date(), nullable=True))
    op.add_column("orgaos", sa.Column("data_instalacao", sa.Date(), nullable=True))
    op.add_column("orgaos", sa.Column("data_fim", sa.Date(), nullable=True))
    op.add_column("orgaos", sa.Column("data_fim_original", sa.Date(), nullable=True))
    op.add_column("orgaos", sa.Column("cod_situacao", sa.Integer(), nullable=True))
    op.add_column("orgaos", sa.Column("descricao_situacao", sa.String(), nullable=True))
    op.add_column("orgaos", sa.Column("sala", sa.String(), nullable=True))
    op.add_column("orgaos", sa.Column("url_website", sa.String(), nullable=True))

    # Add indexes
    op.create_index(op.f("ix_orgaos_sigla"), "orgaos", ["sigla"], unique=False)
    op.create_index(
        op.f("ix_orgaos_cod_tipo_orgao"), "orgaos", ["cod_tipo_orgao"], unique=False
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Remove indexes
    op.drop_index(op.f("ix_orgaos_cod_tipo_orgao"), table_name="orgaos")
    op.drop_index(op.f("ix_orgaos_sigla"), table_name="orgaos")

    # Remove columns
    op.drop_column("orgaos", "url_website")
    op.drop_column("orgaos", "sala")
    op.drop_column("orgaos", "descricao_situacao")
    op.drop_column("orgaos", "cod_situacao")
    op.drop_column("orgaos", "data_fim_original")
    op.drop_column("orgaos", "data_fim")
    op.drop_column("orgaos", "data_instalacao")
    op.drop_column("orgaos", "data_inicio")
    op.drop_column("orgaos", "cod_tipo_orgao")
    op.drop_column("orgaos", "nome_publicacao")

    # Rename 'tipo_orgao' back to 'tipo'
    op.alter_column("orgaos", "tipo_orgao", new_column_name="tipo")
