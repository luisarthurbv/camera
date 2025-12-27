from enum import Enum


class Sexo(str, Enum):
    MASCULINO = "M"
    FEMININO = "F"


class Voto(str, Enum):
    ABSTENCAO = "ABSTENCAO"
    ARTIGO_17 = "ARTIGO_17"
    NAO = "NAO"
    OBSTRUCAO = "OBSTRUCAO"
    SIM = "SIM"


class Casa(str, Enum):
    CAMARA_DOS_DEPUTADOS = "CAMARA_DOS_DEPUTADOS"
    CONGRESSO_NACIONAL = "CONGRESSO_NACIONAL"
