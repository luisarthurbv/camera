import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Casa } from '@orgaos/domain/orgao';

@Table({
  tableName: 'orgaos',
  timestamps: true,
})
export class OrgaoModel extends Model<OrgaoModel> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  sigla: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  apelido: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  tipo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  nome: string;

  @Column({
    type: DataType.ENUM(...(Object.values(Casa) as string[])),
    allowNull: false,
  })
  casa: Casa;
}
