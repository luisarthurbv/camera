import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { Sexo } from '@commons/enums/sexo';
import { ProfissaoModel } from './profissao.model';
import { OcupacaoModel } from './ocupacao.model';
import { DeputadoLegislaturaModel } from './deputado-legislatura.model';

@Table({
  tableName: 'deputados',
  timestamps: true,
})
export class DeputadoModel extends Model<DeputadoModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  cpf: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nomeCivil: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nome: string | null;

  @Column({
    type: DataType.STRING(1),
    allowNull: true,
  })
  sexo: Sexo | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dataNascimento: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dataFalecimento: Date | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ufNascimento: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  municipioNascimento: string | null;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  redesSociais: string[] | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  website: string | null;

  @HasMany(() => ProfissaoModel)
  profissoes: ProfissaoModel[];

  @HasMany(() => OcupacaoModel)
  ocupacoes: OcupacaoModel[];

  @HasMany(() => DeputadoLegislaturaModel)
  legislaturas: DeputadoLegislaturaModel[];
}
