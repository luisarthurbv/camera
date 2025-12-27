import { Voto } from '@commons/enums/voto';

export interface VotacaoDeputado {
  idVotacao: string;
  deputadoId: number;
  voto: Voto;
  votoMoment: Date;
}
