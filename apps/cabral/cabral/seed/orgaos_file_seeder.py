import csv
import logging
import os
from datetime import datetime

from shared_domain import Orgao, OrgaoRepository, enums, get_session

logger = logging.getLogger(__name__)


class OrgaoSeedFileService:
    def __init__(self, resources_path: str):
        self.resources_path = resources_path

    async def seed(self):
        logger.info("🌱 Starting Orgaos File seeding...")
        await self.seed_orgaos_from_csv()
        logger.info("✅ Orgaos File seeding complete!")

    async def seed_orgaos_from_csv(self):
        csv_path = os.path.join(self.resources_path, "orgaos.csv")
        if not os.path.exists(csv_path):
            logger.error(f"❌ CSV file not found: {csv_path}")
            return

        logger.info(f"📥 Seeding Orgaos from {csv_path}...")

        with open(csv_path, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f, delimiter=";")
            processed_count = 0

            with next(get_session()) as session:
                repo = OrgaoRepository(session)
                for row in reader:
                    # Clean up keys (remove quotes if present)
                    row = {k.strip('"'): v for k, v in row.items()}

                    try:
                        uri = row.get("uri")
                        if not uri:
                            logger.warning(f"⚠️ Row missing URI: {row}")
                            continue
                        # Extract ID from uri (last digit)
                        orgao_id = int(uri.split("/")[-1])

                        existing_orgao = repo.get(orgao_id)

                        # Map Casa Enum
                        casa_str = row.get("casa", "")
                        if "Câmara dos Deputados" in casa_str:
                            casa = enums.Casa.CAMARA_DOS_DEPUTADOS
                        else:
                            casa = enums.Casa.CONGRESSO_NACIONAL

                        orgao_data = {
                            "id": orgao_id,
                            "sigla": row["sigla"],
                            "apelido": row["apelido"],
                            "nome": row["nome"],
                            "nome_publicacao": row.get("nomePublicacao"),
                            "cod_tipo_orgao": int(row["codTipoOrgao"])
                            if row.get("codTipoOrgao")
                            else 0,
                            "tipo_orgao": row["tipoOrgao"],
                            "data_inicio": self._parse_date(row.get("dataInicio")),
                            "data_instalacao": self._parse_date(
                                row.get("dataInstalacao")
                            ),
                            "data_fim": self._parse_date(row.get("dataFim")),
                            "data_fim_original": self._parse_date(
                                row.get("dataFimOriginal")
                            ),
                            "cod_situacao": int(row["codSituacao"])
                            if row.get("codSituacao")
                            else None,
                            "descricao_situacao": row.get("descricaoSituacao"),
                            "casa": casa,
                            "sala": row.get("sala"),
                            "url_website": row.get("urlWebsite"),
                        }

                        if not existing_orgao:
                            orgao = Orgao(**orgao_data)
                            repo.create(orgao)
                            processed_count += 1
                        else:
                            # Update existing orgao
                            for key, value in orgao_data.items():
                                setattr(existing_orgao, key, value)
                            repo.update(existing_orgao)
                            processed_count += 1
                    except Exception as e:
                        logger.error(
                            f"❌ Error processing record for {row.get('nome')}: {e}"
                        )

                session.commit()
                logger.info(f"✅ Processed {processed_count} new orgaos from CSV.")

    def _parse_date(self, date_str):
        if not date_str or date_str == "":
            return None
        try:
            # Format in CSV seems to be 2020-03-20T00:00:00
            return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S").date()
        except ValueError:
            try:
                # Fallback for just date
                return datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                return None
