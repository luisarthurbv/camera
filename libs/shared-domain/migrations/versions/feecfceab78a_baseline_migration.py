"""baseline_migration

Revision ID: feecfceab78a
Revises:
Create Date: 2025-12-27 19:01:43.905303

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "feecfceab78a"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- Table: legislaturas ---
    op.create_table(
        "legislaturas",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("data_inicio", sa.Date(), nullable=False),
        sa.Column("data_fim", sa.Date(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- Table: partidos ---
    op.create_table(
        "partidos",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nome", sa.String(), nullable=False),
        sa.Column("sigla", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nome"),
        sa.UniqueConstraint("sigla"),
    )

    # --- Table: deputados ---
    op.create_table(
        "deputados",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("cpf", sa.String(), nullable=True),
        sa.Column("nome_civil", sa.String(), nullable=False),
        sa.Column("nome", sa.String(), nullable=True),
        sa.Column("sexo", sa.Enum("MASCULINO", "FEMININO", name="sexo"), nullable=True),
        sa.Column("data_nascimento", sa.Date(), nullable=True),
        sa.Column("data_falecimento", sa.Date(), nullable=True),
        sa.Column("uf_nascimento", sa.String(), nullable=True),
        sa.Column("municipio_nascimento", sa.String(), nullable=True),
        sa.Column("redes_sociais", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("website", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("cpf"),
    )
    op.create_index("idx_deputados_cpf", "deputados", ["cpf"])
    op.create_index("idx_deputados_nome_civil", "deputados", ["nome_civil"])

    # --- Table: deputado_legislatura ---
    op.create_table(
        "deputado_legislatura",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("deputado_id", sa.Integer(), nullable=False),
        sa.Column("legislatura_id", sa.Integer(), nullable=False),
        sa.Column("partido_id", sa.Integer(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("estado", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["deputado_id"],
            ["deputados.id"],
        ),
        sa.ForeignKeyConstraint(
            ["legislatura_id"],
            ["legislaturas.id"],
        ),
        sa.ForeignKeyConstraint(
            ["partido_id"],
            ["partidos.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "idx_deputado_legislatura_deputado_id", "deputado_legislatura", ["deputado_id"]
    )
    op.create_index(
        "idx_deputado_legislatura_legislatura_id",
        "deputado_legislatura",
        ["legislatura_id"],
    )
    op.create_index(
        "idx_deputado_legislatura_partido_id", "deputado_legislatura", ["partido_id"]
    )

    # --- Table: deputado_ocupacao ---
    op.create_table(
        "deputado_ocupacao",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("deputado_id", sa.Integer(), nullable=False),
        sa.Column("titulo", sa.String(), nullable=False),
        sa.Column("entidade", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["deputado_id"],
            ["deputados.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_ocupacao_deputado_id", "deputado_ocupacao", ["deputado_id"])

    # --- Table: deputado_profissao ---
    op.create_table(
        "deputado_profissao",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("deputado_id", sa.Integer(), nullable=False),
        sa.Column("titulo", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["deputado_id"],
            ["deputados.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_profissao_deputado_id", "deputado_profissao", ["deputado_id"])

    # --- Table: orgaos ---
    op.create_table(
        "orgaos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("sigla", sa.String(), nullable=False),
        sa.Column("apelido", sa.String(), nullable=False),
        sa.Column("tipo", sa.String(), nullable=False),
        sa.Column("nome", sa.String(), nullable=False),
        sa.Column(
            "casa",
            sa.Enum("CAMARA_DOS_DEPUTADOS", "CONGRESSO_NACIONAL", name="casa"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- Table: membros ---
    op.create_table(
        "membros",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("deputado_id", sa.Integer(), nullable=False),
        sa.Column("partido_id", sa.Integer(), nullable=False),
        sa.Column("legislatura_id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["deputado_id"],
            ["deputados.id"],
        ),
        sa.ForeignKeyConstraint(
            ["legislatura_id"],
            ["legislaturas.id"],
        ),
        sa.ForeignKeyConstraint(
            ["partido_id"],
            ["partidos.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- Table: votacoes ---
    op.create_table(
        "votacoes",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # --- Table: votacoes_deputados ---
    op.create_table(
        "votacoes_deputados",
        sa.Column("id_votacao", sa.String(), nullable=False),
        sa.Column("deputado_id", sa.Integer(), nullable=False),
        sa.Column(
            "voto",
            sa.Enum("ABSTENCAO", "ARTIGO_17", "NAO", "OBSTRUCAO", "SIM", name="voto"),
            nullable=False,
        ),
        sa.Column("voto_moment", sa.DateTime(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["deputado_id"],
            ["deputados.id"],
        ),
        sa.ForeignKeyConstraint(
            ["id_votacao"],
            ["votacoes.id"],
        ),
        sa.PrimaryKeyConstraint("id_votacao", "deputado_id"),
    )


def downgrade() -> None:
    op.drop_table("votacoes_deputados")
    op.drop_table("votacoes")
    op.drop_table("membros")
    op.drop_table("orgaos")
    op.drop_table("deputado_profissao")
    op.drop_table("deputado_ocupacao")
    op.drop_table("deputado_legislatura")
    op.drop_table("deputados")
    op.drop_table("partidos")
    op.drop_table("legislaturas")
    # Types
    sa.Enum(name="sexo").drop(op.get_bind())
    sa.Enum(name="casa").drop(op.get_bind())
    sa.Enum(name="voto").drop(op.get_bind())
