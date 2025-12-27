import { Sexo } from '@commons/enums/sexo';
import { Profissao } from './profissao';
import { Ocupacao } from './ocupacao';
import { DeputadoLegislatura } from './deputado-legislatura';

export interface Deputado {
  id: number;
  cpf: string | null;
  nomeCivil: string;
  nome: string | null;
  sexo: Sexo | null;
  dataNascimento: Date | null;
  dataFalecimento: Date | null;
  ufNascimento: string | null;
  municipioNascimento: string | null;
  redesSociais: string[] | null;
  website: string | null;
}

export interface DeputadoCompleto extends Deputado {
  profissoes: Profissao[];
  ocupacoes: Ocupacao[];
  deputadoLegislaturas: DeputadoLegislatura[];
}
