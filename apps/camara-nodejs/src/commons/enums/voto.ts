export const ABSTENCAO = 'ABSTENCAO';
export const ARTIGO_17 = 'ARTIGO_17';
export const NAO = 'NAO';
export const OBSTRUCAO = 'OBSTRUCAO';
export const SIM = 'SIM';

export type Voto =
  | typeof ABSTENCAO
  | typeof ARTIGO_17
  | typeof NAO
  | typeof OBSTRUCAO
  | typeof SIM;
