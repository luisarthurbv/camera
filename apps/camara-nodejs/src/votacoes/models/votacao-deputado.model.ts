import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Voto } from '@commons/enums/voto';
import { VotacaoModel } from './votacao.model';
import { DeputadoModel } from '@deputados/models/deputado.model';

@Table({
  tableName: 'votacoes_deputados',
  timestamps: true,
})
export class VotacaoDeputadoModel extends Model<VotacaoDeputadoModel> {
  @PrimaryKey
  @ForeignKey(() => VotacaoModel)
  @Column(DataType.STRING)
  idVotacao: string;

  @PrimaryKey
  @ForeignKey(() => DeputadoModel)
  @Column(DataType.INTEGER)
  deputadoId: number;

  @Column({
    type: DataType.ENUM('ABSTENCAO', 'ARTIGO_17', 'NAO', 'OBSTRUCAO', 'SIM'),
    allowNull: false,
  })
  voto: Voto;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  votoMoment: Date;

  @BelongsTo(() => VotacaoModel)
  votacao: VotacaoModel;

  @BelongsTo(() => DeputadoModel)
  deputado: DeputadoModel;
}
