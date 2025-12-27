import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { DeputadoModel } from './deputado.model';

@Table({
  tableName: 'deputado_ocupacao',
  timestamps: true,
})
export class OcupacaoModel extends Model<OcupacaoModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => DeputadoModel)
  @Index('idx_ocupacao_deputado_id')
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  deputadoId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  titulo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  entidade: string;

  @BelongsTo(() => DeputadoModel)
  deputado: DeputadoModel;
}
