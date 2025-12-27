// Types for Proposição (Proposition) related endpoints

export interface Proposicao {
  id: number;
  uri: string;
  siglaTipo: string;
  codTipo: number;
  numero: number;
  ano: number;
  ementa: string;
}

export interface ProposicaoDetalhada extends Proposicao {
  dataApresentacao: string;
  dataPublicacao?: string;
  uriOrgaoNumerador: string;
  statusProposicao: {
    dataHora: string;
    sequencia: number;
    siglaOrgao: string;
    uriOrgao: string;
    uriRelator?: string;
    regime: string;
    descricaoSituacao: string;
    codSituacao: number;
    descricaoTramitacao: string;
    codTipoTramitacao: number;
    despacho?: string;
    url?: string;
    ambito?: string;
  };
  uriAutores: string;
  descricaoTipo: string;
  ementaDetalhada?: string;
  keywords?: string;
  uriPropPrincipal?: string;
  uriPropAnterior?: string;
  uriPropPosterior?: string;
  urlInteiroTeor?: string;
  urnFinal?: string;
  texto?: string;
  justificativa?: string;
}

export interface ProposicaoAutor {
  id: number;
  uri: string;
  nome: string;
  codTipo: number;
  tipo: string;
  ordemAssinatura: number;
  proponente: number;
}

export interface ProposicaoRelacionada {
  id: number;
  uri: string;
  siglaTipo: string;
  codTipo: number;
  numero: number;
  ano: number;
  codTipoRelacao: number;
  tipoRelacao: string;
}

export interface ProposicaoTema {
  codTema: number;
  tema: string;
  relevancia: number;
}

export interface ProposicaoTramitacao {
  dataHora: string;
  sequencia: number;
  siglaOrgao: string;
  uriOrgao: string;
  regime: string;
  descricaoSituacao: string;
  codSituacao: number;
  descricaoTramitacao: string;
  codTipoTramitacao: number;
  despacho?: string;
  url?: string;
  ambito?: string;
}

export interface ProposicaoVotacao {
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

// Query parameters for proposições endpoints
export interface ProposicoesQueryParams {
  siglaTipo?: string[];
  numero?: number;
  ano?: number;
  dataApresentacaoInicio?: string;
  dataApresentacaoFim?: string;
  dataPublicacaoInicio?: string;
  dataPublicacaoFim?: string;
  idAutor?: number;
  autor?: string;
  siglaPartidoAutor?: string;
  siglaUfAutor?: string;
  keywords?: string;
  tramitacaoSenado?: boolean;
  codSituacao?: number[];
  codTema?: number[];
  pagina?: number;
  itens?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: 'id' | 'numero' | 'ano' | 'dataApresentacao';
}
