import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { DeputadoLegislaturaModel } from '@deputados/models/deputado-legislatura.model';

@Table({
  tableName: 'partidos',
  timestamps: true,
})
export class PartidoModel extends Model<PartidoModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nome: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  sigla: string;

  @HasMany(() => DeputadoLegislaturaModel)
  deputadoLegislaturas: DeputadoLegislaturaModel[];
}
