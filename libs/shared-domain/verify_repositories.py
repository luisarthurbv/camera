import os
import sys
from sqlmodel import SQLModel, Session, select

# Add the project root to sys.path
sys.path.append("/home/lvalini/development/camera/libs/shared-domain")

from shared_domain import (
    Deputado,
    Partido,
    DeputadoRepository,
    PartidoRepository,
    engine,
    init_db,
)


def test_repositories():
    # Initialize the database (this will create tables if they don't exist)
    # Be careful: this uses the real DB configured in DATABASE_URL
    print("Initializing database...")
    init_db()

    with Session(engine) as session:
        # Repositories
        dep_repo = DeputadoRepository(session)
        par_repo = PartidoRepository(session)

        # Cleanup previous test data if any
        existing_par = par_repo.get_by_sigla("PTST")
        if existing_par:
            print(f"Cleaning up existing Partido: {existing_par.sigla}")
            # Instead of deleting (which might fail due to FKs), we'll just use a unique name
            pass

        import uuid

        unique_sigla = f"T{uuid.uuid4().hex[:4]}".upper()

        # 1. Create a Partido
        par = Partido(nome=f"Partido Teste {unique_sigla}", sigla=unique_sigla)
        par_repo.create(par)
        print(f"Created Partido: {par.sigla} (ID: {par.id})")

        # 2. Create a Deputado
        unique_cpf = f"{uuid.uuid4().int}"[:11]
        dep = Deputado(
            nome_civil=f"Deputado Teste {unique_sigla}", nome="Teste", cpf=unique_cpf
        )
        dep_repo.create(dep)
        print(f"Created Deputado: {dep.nome} (ID: {dep.id})")

        # 3. Test Retrieval
        retrieved_par = par_repo.get_by_sigla(unique_sigla)
        assert retrieved_par is not None
        assert retrieved_par.sigla == unique_sigla
        print("Partido retrieval verified.")

        retrieved_dep = dep_repo.get_by_cpf(unique_cpf)
        assert retrieved_dep is not None
        assert retrieved_dep.nome_civil == f"Deputado Teste {unique_sigla}"
        print("Deputado retrieval verified.")

        # 4. Test Search
        search_results = dep_repo.search_by_name("Tes")
        assert len(search_results) >= 1
        print("Deputado search verified.")

        # Cleanup
        session.delete(dep)
        session.delete(par)
        session.commit()
        print("Test data cleaned up.")


if __name__ == "__main__":
    try:
        test_repositories()
        print("\nVerification successful!")
    except Exception as e:
        print(f"\nVerification failed: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
