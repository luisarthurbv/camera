// Types for Deputado (Deputy) related endpoints

export interface Deputado {
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  idLegislatura: number;
  urlFoto: string;
  email?: string;
}

export interface DeputadoDetalhado extends Deputado {
  nomeCivil?: string;
  cpf?: string;
  sexo?: string;
  dataNascimento?: string;
  dataFalecimento?: string;
  ufNascimento?: string;
  municipioNascimento?: string;
  escolaridade?: string;
  redeSocial?: string[];
  gabinete?: {
    nome: string;
    predio: string;
    sala: string;
    andar: string;
    telefone: string;
    email: string;
  };
  situacao?: {
    id: number;
    nome: string;
    descricao: string;
  };
  condicaoEleitoral?: string;
  ultimoStatus?: {
    id: number;
    uri: string;
    nome: string;
    siglaPartido: string;
    uriPartido: string;
    siglaUf: string;
    idLegislatura: number;
    urlFoto: string;
    data: string;
    nomeEleitoral: string;
    gabinete: {
      nome: string;
      predio: string;
      sala: string;
      andar: string;
      telefone: string;
      email: string;
    };
    situacao: {
      id: number;
      nome: string;
      descricao: string;
    };
    condicaoEleitoral: string;
    descricaoStatus?: string;
  };
}

export interface DeputadoDespesa {
  ano: number;
  mes: number;
  tipoDespesa: string;
  codDocumento: number;
  tipoDocumento: string;
  codTipoDocumento: number;
  dataDocumento: string;
  numDocumento: string;
  valorDocumento: number;
  urlDocumento: string;
  nomeFornecedor: string;
  cnpjCpfFornecedor: string;
  valorLiquido: number;
  valorGlosa: number;
  numRessarcimento: string;
  codLote: number;
  parcela: number;
}

export interface DeputadoDiscurso {
  id: string;
  uri: string;
  evento: {
    id: number;
    uri: string;
    descricao: string;
  };
  fase: {
    id: number;
    uri: string;
    titulo: string;
  };
  orador: {
    id: number;
    uri: string;
    nome: string;
    partido: string;
    uf: string;
  };
  dataHoraInicio: string;
  dataHoraFim: string;
  tipoDiscurso: string;
  transcricao: string;
  sumario: string;
  keywords: string;
  urlAudio: string;
  urlTexto: string;
  urlVideo: string;
}

export interface DeputadoEvento {
  id: number;
  uri: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  situacao: string;
  descricaoTipo: string;
  descricao: string;
  localExterno: string;
  orgaos: {
    id: number;
    uri: string;
    sigla: string;
    nome: string;
    apelido: string;
  }[];
  urlRegistro: string;
}

export interface DeputadoFrente {
  id: number;
  uri: string;
  titulo: string;
  idLegislatura: number;
}

export interface DeputadoHistorico {
  id: number;
  idLegislatura: number;
  dataInicio: string;
  dataFim: string;
  siglaPartido: string;
  idPartido: number;
  siglaUf: string;
  idSituacao: number;
  situacao: string;
  condicaoEleitoral: string;
  descricaoStatus: string;
}

export interface DeputadoMandatoExterno {
  id: number;
  anoEleicao: number;
  cargo: string;
  entidade: string;
  localidade: string;
  uf: string;
  resultado: string;
}

export interface DeputadoOcupacao {
  id: number;
  titulo: string;
  entidade: string;
  anoInicio: number;
  anoFim: number;
}

export interface DeputadoOrgao {
  id: number;
  uri: string;
  sigla: string;
  nome: string;
  titulo: string;
  dataInicio: string;
  dataFim: string;
}

export interface DeputadoProfissao {
  id: number;
  titulo: string;
  codTipoProfissao: number;
  tipoProfissao: string;
}

// Query parameters for deputados endpoints
export interface DeputadosQueryParams {
  id?: number[];
  nome?: string;
  idLegislatura?: number;
  siglaUf?: string[];
  siglaPartido?: string[];
  siglaSexo?: 'M' | 'F';
  pagina?: number;
  itens?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: 'id' | 'nome' | 'siglaUf' | 'siglaPartido';
}

export interface DeputadoDespesasQueryParams {
  idDeputado: number;
  idLegislatura?: number;
  ano?: number;
  mes?: number;
  cnpjCpfFornecedor?: string;
  pagina?: number;
  itens?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: 'ano' | 'mes' | 'valorDocumento' | 'numDocumento';
}

export interface DeputadoDiscursosQueryParams {
  idDeputado: number;
  dataInicio?: string;
  dataFim?: string;
  idLegislatura?: number;
  pagina?: number;
  itens?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: 'dataHoraInicio' | 'evento';
}
