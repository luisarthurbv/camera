import csv
import logging
import os
from datetime import datetime

from shared_domain import Deputado, DeputadoRepository, enums, get_session

logger = logging.getLogger(__name__)


class DeputadosSeedFileService:
    def __init__(self, resources_path: str):
        self.resources_path = resources_path

    async def seed(self):
        logger.info("🌱 Starting File seeding...")
        await self.seed_deputados_from_csv()
        logger.info("✅ File seeding complete!")

    async def seed_deputados_from_csv(self):
        csv_path = os.path.join(self.resources_path, "deputados.csv")
        if not os.path.exists(csv_path):
            logger.error(
                f"❌ CSV file not found: {csv_path}",
                extra={"resource_path": self.resources_path},
            )
            return

        logger.info(f"📥 Seeding Deputados from {csv_path}...")

        with open(csv_path, encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=";")
            processed_count = 0

            with next(get_session()) as session:
                repo = DeputadoRepository(session)
                for row in reader:
                    try:
                        # Extract ID from apiUri
                        uri = row.get("uri") or row.get("apiUri")
                        if not uri:
                            continue
                        deputado_id = int(uri.split("/")[-1])

                        if not repo.get(deputado_id):
                            deputado = Deputado(
                                id=deputado_id,
                                nome_civil=row["nomeCivil"],
                                nome=row["nome"],
                                cpf=row.get("cpf") if row.get("cpf") else None,
                                sexo=enums.Sexo(row["siglaSexo"]),
                                data_nascimento=datetime.strptime(
                                    row["dataNascimento"], "%Y-%m-%d"
                                ).date()
                                if row.get("dataNascimento")
                                else None,
                                data_falecimento=datetime.strptime(
                                    row["dataFalecimento"], "%Y-%m-%d"
                                ).date()
                                if row.get("dataFalecimento")
                                else None,
                                uf_nascimento=row.get("ufNascimento"),
                                municipio_nascimento=row.get("municipioNascimento"),
                                website=row.get("urlWebsite"),
                                redes_sociais=[
                                    url.strip()
                                    for url in row.get("urlRedeSocial", "").split(", ")
                                    if url.strip()
                                ]
                                if row.get("urlRedeSocial")
                                else None,
                            )
                            repo.create(deputado)
                            processed_count += 1
                    except Exception as e:
                        logger.error(
                            f"❌ Error processing record for "
                            f"{row.get('nomeCivil')}: {e}"
                        )

                session.commit()
                logger.info(f"✅ Processed {processed_count} new deputados from CSV.")
