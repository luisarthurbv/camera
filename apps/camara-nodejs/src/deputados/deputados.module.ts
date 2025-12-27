import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DeputadosController } from './controllers/deputados.controller';
import { DeputadosService } from './services/deputados.service';
import { DeputadosRepository } from './repository/deputados.repository';
import { ProfissoesRepository } from './repository/profissoes.repository';
import { OcupacoesRepository } from './repository/ocupacoes.repository';
import { DeputadoLegislaturasRepository } from './repository/deputado-legislaturas.repository';
import { DeputadoModel } from './models/deputado.model';
import { ProfissaoModel } from './models/profissao.model';
import { OcupacaoModel } from './models/ocupacao.model';
import { DeputadoLegislaturaModel } from './models/deputado-legislatura.model';
import { ClientModule } from '@client/client.module';

@Module({
  imports: [
    ClientModule,
    SequelizeModule.forFeature([
      DeputadoModel,
      ProfissaoModel,
      OcupacaoModel,
      DeputadoLegislaturaModel,
    ]),
  ],
  controllers: [DeputadosController],
  providers: [
    DeputadosService,
    DeputadosRepository,
    ProfissoesRepository,
    OcupacoesRepository,
    DeputadoLegislaturasRepository,
  ],
  exports: [
    DeputadosService,
    DeputadosRepository,
    ProfissoesRepository,
    OcupacoesRepository,
    DeputadoLegislaturasRepository,
  ],
})
export class DeputadosModule {}
