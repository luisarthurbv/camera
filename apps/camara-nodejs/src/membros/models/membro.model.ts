import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DeputadoModel } from '@deputados/models/deputado.model';
import { PartidoModel } from '@partidos/models/partido.model';
import { LegislaturaModel } from '@legislaturas/models/legislatura.model';

@Table({
  tableName: 'membros',
  timestamps: true,
})
export class MembroModel extends Model<MembroModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => DeputadoModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'deputadoId',
  })
  deputadoId: number;

  @BelongsTo(() => DeputadoModel)
  deputado: DeputadoModel;

  @ForeignKey(() => PartidoModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'partidoId',
  })
  partidoId: number;

  @BelongsTo(() => PartidoModel)
  partido: PartidoModel;

  @ForeignKey(() => LegislaturaModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'legislaturaId',
  })
  legislaturaId: number;

  @BelongsTo(() => LegislaturaModel)
  legislatura: LegislaturaModel;
}
