import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VotacaoDeputadoModel } from '../models/votacao-deputado.model';
import { VotacaoDeputado } from '../domain/votacao-deputado';

@Injectable()
export class VotacoesDeputadosRepository {
  constructor(
    @InjectModel(VotacaoDeputadoModel)
    private votacaoDeputadoModel: typeof VotacaoDeputadoModel,
  ) {}

  private convert(votacaoDeputadoModel: VotacaoDeputadoModel): VotacaoDeputado {
    return {
      idVotacao: votacaoDeputadoModel.idVotacao,
      deputadoId: votacaoDeputadoModel.deputadoId,
      voto: votacaoDeputadoModel.voto,
      votoMoment: votacaoDeputadoModel.votoMoment,
    };
  }

  async findAll(): Promise<VotacaoDeputado[]> {
    const votacoes = await this.votacaoDeputadoModel.findAll();
    return votacoes.map((votacao) => this.convert(votacao));
  }

  async findByVotacaoId(idVotacao: string): Promise<VotacaoDeputado[]> {
    const votacoes = await this.votacaoDeputadoModel.findAll({
      where: { idVotacao },
    });
    return votacoes.map((votacao) => this.convert(votacao));
  }

  async findByDeputadoId(deputadoId: number): Promise<VotacaoDeputado[]> {
    const votacoes = await this.votacaoDeputadoModel.findAll({
      where: { deputadoId },
    });
    return votacoes.map((votacao) => this.convert(votacao));
  }

  async findById(
    idVotacao: string,
    deputadoId: number,
  ): Promise<VotacaoDeputado | null> {
    const votacao = await this.votacaoDeputadoModel.findOne({
      where: { idVotacao, deputadoId },
    });
    if (!votacao) return null;

    return this.convert(votacao);
  }

  async create(votacaoDeputadoData: VotacaoDeputado): Promise<VotacaoDeputado> {
    const votacao = await this.votacaoDeputadoModel.create(votacaoDeputadoData);
    return this.convert(votacao);
  }

  async update(
    idVotacao: string,
    deputadoId: number,
    votacaoDeputadoData: Partial<
      Omit<VotacaoDeputado, 'idVotacao' | 'deputadoId'>
    >,
  ): Promise<VotacaoDeputado | null> {
    const [affectedCount] = await this.votacaoDeputadoModel.update(
      votacaoDeputadoData,
      {
        where: { idVotacao, deputadoId },
      },
    );

    if (affectedCount === 0) return null;

    return this.findById(idVotacao, deputadoId);
  }

  async delete(idVotacao: string, deputadoId: number): Promise<boolean> {
    const affectedCount = await this.votacaoDeputadoModel.destroy({
      where: { idVotacao, deputadoId },
    });

    return affectedCount > 0;
  }
}
