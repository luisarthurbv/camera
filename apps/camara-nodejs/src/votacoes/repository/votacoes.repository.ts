import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VotacaoModel } from '../models/votacao.model';
import { Votacao } from '../domain/votacao';

@Injectable()
export class VotacoesRepository {
  constructor(
    @InjectModel(VotacaoModel)
    private votacaoModel: typeof VotacaoModel,
  ) {}

  private convert(votacaoModel: VotacaoModel): Votacao {
    return {
      id: votacaoModel.id,
    };
  }

  async findAll(): Promise<Votacao[]> {
    const votacoes = await this.votacaoModel.findAll();
    return votacoes.map((votacao) => this.convert(votacao));
  }

  async findById(id: string): Promise<Votacao | null> {
    const votacao = await this.votacaoModel.findByPk(id);
    if (!votacao) return null;

    return this.convert(votacao);
  }

  async create(votacaoData: Votacao): Promise<Votacao> {
    const votacao = await this.votacaoModel.create(votacaoData);
    return this.convert(votacao);
  }

  async update(
    id: string,
    votacaoData: Partial<Omit<Votacao, 'id'>>,
  ): Promise<Votacao | null> {
    const [affectedCount] = await this.votacaoModel.update(votacaoData, {
      where: { id },
    });

    if (affectedCount === 0) return null;

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await this.votacaoModel.destroy({
      where: { id },
    });

    return affectedCount > 0;
  }
}
