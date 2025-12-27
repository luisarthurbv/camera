export enum Casa {
  CAMARA_DOS_DEPUTADOS = 'CAMARA_DOS_DEPUTADOS',
  CONGRESSO_NACIONAL = 'CONGRESSO_NACIONAL',
}

export interface Orgao {
  id: number;
  sigla: string;
  apelido: string;
  tipo: string;
  nome: string;
  casa: Casa;
}
