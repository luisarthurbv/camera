// Types for Evento (Event) related endpoints

export interface Evento {
  id: number;
  uri: string;
  dataHoraInicio: string;
  dataHoraFim?: string;
  situacao: string;
  descricaoTipo: string;
  descricao: string;
  localCamara?: {
    nome: string;
    predio: string;
    sala: string;
    andar: string;
  };
  localExterno?: string;
  orgaos: EventoOrgao[];
  urlRegistro?: string;
}

export interface EventoDetalhado extends Evento {
  fases?: EventoFase[];
  requerimentos?: EventoRequerimento[];
  deputados?: EventoDeputado[];
}

export interface EventoOrgao {
  id: number;
  uri: string;
  sigla: string;
  nome: string;
  apelido?: string;
}

export interface EventoFase {
  id: number;
  titulo: string;
  dataHoraInicio: string;
  dataHoraFim?: string;
}

export interface EventoRequerimento {
  id: number;
  uri: string;
  titulo: string;
}

export interface EventoDeputado {
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
}

// Query parameters for eventos endpoints
export interface EventosQueryParams {
  id?: number[];
  dataInicio?: string;
  dataFim?: string;
  horaInicio?: string;
  horaFim?: string;
  codSituacao?: number[];
  codTipoEvento?: number[];
  idOrgao?: number[];
  pagina?: number;
  itens?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: 'id' | 'dataHoraInicio' | 'siglaOrgao';
}
