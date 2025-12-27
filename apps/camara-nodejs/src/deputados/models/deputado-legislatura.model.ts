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
import { DeputadoModel } from '@deputados/models/deputado.model';
import { PartidoModel } from '@partidos/models/partido.model';
import { LegislaturaModel } from '@legislaturas/models/legislatura.model';

@Table({
  tableName: 'deputado_legislatura',
  timestamps: true,
})
export class DeputadoLegislaturaModel extends Model<DeputadoLegislaturaModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => DeputadoModel)
  @Index('idx_deputado_legislatura_deputado_id')
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  deputadoId: number;

  @ForeignKey(() => LegislaturaModel)
  @Index('idx_deputado_legislatura_legislatura_id')
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  legislaturaId: number;

  @ForeignKey(() => PartidoModel)
  @Index('idx_deputado_legislatura_partido_id')
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  partidoId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  estado: string;

  @BelongsTo(() => DeputadoModel)
  deputado: DeputadoModel;

  @BelongsTo(() => LegislaturaModel)
  legislatura: LegislaturaModel;

  @BelongsTo(() => PartidoModel)
  partido: PartidoModel;
}
