import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import type { VotacaoDeputadoModel } from './votacao-deputado.model';

@Table({
  tableName: 'votacoes',
  timestamps: true,
})
export class VotacaoModel extends Model<VotacaoModel> {
  @PrimaryKey
  @Column(DataType.STRING)
  id: string;

  @HasMany(() => require('./votacao-deputado.model').VotacaoDeputadoModel)
  votosDeputados: VotacaoDeputadoModel[];
}
