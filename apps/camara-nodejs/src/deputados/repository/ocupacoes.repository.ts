import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OcupacaoModel } from '@deputados/models/ocupacao.model';
import { Ocupacao } from '@deputados/domain/ocupacao';

@Injectable()
export class OcupacoesRepository {
  constructor(
    @InjectModel(OcupacaoModel)
    private ocupacaoModel: typeof OcupacaoModel,
  ) {}

  private convert(ocupacaoModel: OcupacaoModel): Ocupacao {
    return {
      id: ocupacaoModel.id,
      titulo: ocupacaoModel.titulo,
      entidade: ocupacaoModel.entidade,
    };
  }

  async create(
    deputadoId: number,
    titulo: string,
    entidade: string,
  ): Promise<Ocupacao> {
    const ocupacao = await this.ocupacaoModel.create({
      deputadoId,
      titulo,
      entidade,
    });
    return this.convert(ocupacao);
  }

  async findByDeputadoId(deputadoId: number): Promise<Ocupacao[]> {
    const ocupacoes = await this.ocupacaoModel.findAll({
      where: { deputadoId },
    });
    return ocupacoes.map((ocupacao) => this.convert(ocupacao));
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await this.ocupacaoModel.destroy({
      where: { id },
    });
    return affectedCount > 0;
  }

  async deleteByDeputadoId(deputadoId: number): Promise<number> {
    return await this.ocupacaoModel.destroy({
      where: { deputadoId },
    });
  }
}
