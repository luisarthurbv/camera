import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VotacaoModel } from '@votacoes/models/votacao.model';
import { VotacaoDeputadoModel } from '@votacoes/models/votacao-deputado.model';
import { VotacoesRepository } from '@votacoes/repository/votacoes.repository';
import { VotacoesDeputadosRepository } from '@votacoes/repository/votacoes-deputados.repository';

@Module({
  imports: [SequelizeModule.forFeature([VotacaoModel, VotacaoDeputadoModel])],
  providers: [VotacoesRepository, VotacoesDeputadosRepository],
  exports: [VotacoesRepository, VotacoesDeputadosRepository],
})
export class VotacoesModule {}
