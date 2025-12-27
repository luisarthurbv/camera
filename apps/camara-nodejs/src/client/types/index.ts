// Export all types for easy importing

export * from './common.types';
export * from './deputado.types';
export * from './proposicao.types';
export * from './evento.types';

// Additional types for other endpoints
export interface Bloco {
  id: number;
  uri: string;
  nome: string;
  idLegislatura: number;
}

export interface Partido {
  id: number;
  uri: string;
  sigla: string;
  nome: string;
  status: {
    id: number;
    situacao: string;
    totalPosse: number;
    totalMembros: number;
    uriMembros: string;
    lider?: {
      id: number;
      uri: string;
      nome: string;
      siglaPartido: string;
      uriPartido: string;
      siglaUf: string;
      idLegislatura: number;
      urlFoto: string;
    };
  };
}

export interface Orgao {
  id: number;
  uri: string;
  sigla: string;
  nome: string;
  apelido?: string;
  codTipoOrgao: number;
  tipoOrgao: string;
  dataInicio: string;
  dataInstalacao?: string;
  dataFim?: string;
  descricaoSituacao: string;
  casa: string;
  sala?: string;
  url?: string;
  urlWebsite?: string;
}

export interface Legislatura {
  id: number;
  uri: string;
  dataInicio: string;
  dataFim: string;
}

export interface Frente {
  id: number;
  uri: string;
  titulo: string;
  idLegislatura: number;
  situacao: string;
  urlDocumento?: string;
}

export interface Votacao {
  id: string;
  uri: string;
  titulo: string;
  uriEvento: string;
  uriOrgao: string;
  siglaOrgao: string;
  descricao: string;
  descricaoResultado: string;
  placarSim: number;
  placarNao: number;
  placarAbstencao: number;
  data: string;
  dataHoraRegistro: string;
  ultimaAberturaVotacao: string;
  ultimoEncerramento: string;
}

export interface VotoDeputado {
  deputado_: {
    id: number;
    uri: string;
    nome: string;
    siglaPartido: string;
    siglaUf: string;
  };
  tipoVoto: string;
}
