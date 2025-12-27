from typing import Any

import httpx
from pydantic import BaseModel


class ApiResponse(BaseModel):
    dados: Any
    links: list[dict[str, str]] = []


class CamaraApiService:
    BASE_URL = "https://dadosabertos.camara.leg.br/api/v2"

    def __init__(self):
        self.client = httpx.Client(base_url=self.BASE_URL, timeout=30.0)

    def _get(self, endpoint: str, params: dict[str, Any] | None = None) -> ApiResponse:
        response = self.client.get(endpoint, params=params)
        response.raise_for_status()
        return ApiResponse(**response.json())

    def get_partidos(
        self, id_legislatura: int | None = None, ordem: str = "ASC"
    ) -> ApiResponse:
        params = {"ordem": ordem}
        if id_legislatura:
            params["idLegislatura"] = id_legislatura
        return self._get("/partidos", params=params)

    def get_partido_membros(self, partido_id: int, pagina: int = 1) -> ApiResponse:
        params = {"pagina": pagina, "itens": 100}
        return self._get(f"/partidos/{partido_id}/membros", params=params)

    def get_deputado(self, deputado_id: int) -> ApiResponse:
        return self._get(f"/deputados/{deputado_id}")

    def get_legislaturas(self, pagina: int = 1) -> ApiResponse:
        params = {"pagina": pagina, "itens": 100}
        return self._get("/legislaturas", params=params)

    def get_deputados(self, params: dict[str, Any] | None = None) -> ApiResponse:
        return self._get("/deputados", params=params)
