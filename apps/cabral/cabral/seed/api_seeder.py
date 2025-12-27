import asyncio
import logging
from datetime import datetime

from shared_domain import (
    Deputado,
    DeputadoRepository,
    Legislatura,
    LegislaturaRepository,
    Partido,
    PartidoRepository,
    enums,
    get_session,
)

from cabral.seed.api_client import CamaraApiService

logger = logging.getLogger(__name__)


class SeedAPIService:
    def __init__(self, api_service: CamaraApiService):
        self.api_service = api_service
        # Repositories usually need a session,
        # we'll manage sessions per method or use a context manager

    async def seed(self):
        logger.info("🌱 Starting API seeding...")
        await self.seed_legislaturas()
        await self.seed_partidos()
        await self.seed_deputados()
        logger.info("✅ API seeding complete!")

    async def seed_legislaturas(self):
        logger.info("📥 Seeding Legislaturas...")
        response = self.api_service.get_legislaturas()
        with next(get_session()) as session:
            repo = LegislaturaRepository(session)
            for leg_data in response.dados:
                if not repo.get(leg_data["id"]):
                    legislatura = Legislatura(
                        id=leg_data["id"],
                        data_inicio=datetime.fromisoformat(
                            leg_data["dataInicio"]
                        ).date(),
                        data_fim=datetime.fromisoformat(leg_data["dataFim"]).date(),
                    )
                    repo.create(legislatura)
            session.commit()

    async def seed_partidos(self, id_legislatura: int | None = None):
        logger.info(f"📥 Seeding Partidos (Legislatura: {id_legislatura or 'All'})...")
        response = self.api_service.get_partidos(id_legislatura=id_legislatura)
        with next(get_session()) as session:
            repo = PartidoRepository(session)
            for p_data in response.dados:
                if not repo.get(p_data["id"]):
                    partido = Partido(
                        id=p_data["id"], sigla=p_data["sigla"], nome=p_data["nome"]
                    )
                    repo.create(partido)
            session.commit()

    async def seed_deputados(self):
        logger.info("📥 Seeding Deputados...")
        # Following the node logic, seeding by partido members might be more thorough
        with next(get_session()) as session:
            partido_repo = PartidoRepository(session)
            deputado_repo = DeputadoRepository(session)
            partidos = partido_repo.list()

            for partido in partidos:
                logger.info(f"👥 Fetching members for {partido.sigla}...")
                try:
                    response = self.api_service.get_partido_membros(partido.id)
                    for member_data in response.dados:
                        if not deputado_repo.get(member_data["id"]):
                            # Get detailed info
                            detailed_resp = self.api_service.get_deputado(
                                member_data["id"]
                            )
                            d = detailed_resp.dados

                            deputado = Deputado(
                                id=d["id"],
                                nome_civil=d["nomeCivil"],
                                nome=d["ultimoStatus"]["nome"],
                                cpf=d.get("cpf") if d.get("cpf") else None,
                                sexo=enums.Sexo(d["sexo"]),
                                data_nascimento=datetime.fromisoformat(
                                    d["dataNascimento"]
                                ).date()
                                if d.get("dataNascimento")
                                else None,
                                data_falecimento=datetime.fromisoformat(
                                    d["dataFalecimento"]
                                ).date()
                                if d.get("dataFalecimento")
                                else None,
                                uf_nascimento=d.get("ufNascimento"),
                                municipio_nascimento=d.get("municipioNascimento"),
                                website=d.get("urlWebsite"),
                                redes_sociais=d.get("redeSocial"),
                            )
                            deputado_repo.create(deputado)
                    session.commit()
                except Exception as e:
                    logger.error(f"❌ Error seeding members for {partido.sigla}: {e}")
                    session.rollback()
                await asyncio.sleep(0.5)  # Be kind to the API
