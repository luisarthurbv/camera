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
  tableName: 'deputado_profissao',
  timestamps: true,
})
export class ProfissaoModel extends Model<ProfissaoModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => DeputadoModel)
  @Index('idx_profissao_deputado_id')
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

  @BelongsTo(() => DeputadoModel)
  deputado: DeputadoModel;
}
