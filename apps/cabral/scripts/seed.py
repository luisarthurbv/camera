import argparse
import asyncio
import logging
import os
import sys

# Add the app directory to sys.path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from cabral.seed.api_client import CamaraApiService
from cabral.seed.api_seeder import SeedAPIService
from cabral.seed.deputados_file_seeder import DeputadosSeedFileService
from cabral.seed.orgaos_file_seeder import OrgaoSeedFileService

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def main():
    parser = argparse.ArgumentParser(
        description="Seed the database with Câmara dos Deputados data."
    )
    parser.add_argument(
        "--type",
        choices=["api", "file", "both"],
        default="both",
        help="Type of seeding to perform",
    )
    parser.add_argument(
        "--domain",
        choices=["legislaturas", "partidos", "deputados", "orgaos", "all"],
        default="all",
        help="Domain to seed (only for api type)",
    )

    args = parser.parse_args()

    api_client = CamaraApiService()
    api_seeder = SeedAPIService(api_client)

    # Path to resources relative to project root (apps/cabral)
    resources_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../resources")
    )
    deputados_file_seeder = DeputadosSeedFileService(resources_path)
    orgaos_file_seeder = OrgaoSeedFileService(resources_path)

    if args.type in ["api", "both"]:
        if args.domain == "all":
            await api_seeder.seed()
        elif args.domain == "legislaturas":
            await api_seeder.seed_legislaturas()
        elif args.domain == "partidos":
            await api_seeder.seed_partidos()
        elif args.domain == "deputados":
            await api_seeder.seed_deputados()

    if args.type in ["file", "both"]:
        await deputados_file_seeder.seed()
        await orgaos_file_seeder.seed()


if __name__ == "__main__":
    asyncio.run(main())
