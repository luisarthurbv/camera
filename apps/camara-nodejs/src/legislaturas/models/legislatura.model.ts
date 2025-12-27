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
  tableName: 'legislaturas',
  timestamps: true,
})
export class LegislaturaModel extends Model<LegislaturaModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dataInicio: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dataFim: Date;

  @HasMany(() => DeputadoLegislaturaModel)
  deputadoLegislaturas: DeputadoLegislaturaModel[];
}
