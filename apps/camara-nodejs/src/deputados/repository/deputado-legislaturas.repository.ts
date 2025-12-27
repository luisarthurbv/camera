import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DeputadoLegislaturaModel } from '@deputados/models/deputado-legislatura.model';
import { DeputadoLegislatura } from '@deputados/domain/deputado-legislatura';

@Injectable()
export class DeputadoLegislaturasRepository {
  constructor(
    @InjectModel(DeputadoLegislaturaModel)
    private deputadoLegislaturaModel: typeof DeputadoLegislaturaModel,
  ) {}

  private convert(model: DeputadoLegislaturaModel): DeputadoLegislatura {
    return {
      id: model.id,
      deputadoId: model.deputadoId,
      legislaturaId: model.legislaturaId,
      partidoId: model.partidoId,
      startDate: model.startDate,
      endDate: model.endDate,
      estado: model.estado,
    };
  }

  async create(
    deputadoId: number,
    legislaturaId: number,
    partidoId: number,
    startDate: Date,
    endDate: Date,
    estado: string,
  ): Promise<DeputadoLegislatura> {
    const legislatura = await this.deputadoLegislaturaModel.create({
      deputadoId,
      legislaturaId,
      partidoId,
      startDate,
      endDate,
      estado,
    });
    return this.convert(legislatura);
  }

  async findByDeputadoId(deputadoId: number): Promise<DeputadoLegislatura[]> {
    const legislaturas = await this.deputadoLegislaturaModel.findAll({
      where: { deputadoId },
    });
    return legislaturas.map((legislatura) => this.convert(legislatura));
  }

  async findByLegislaturaId(
    legislaturaId: number,
  ): Promise<DeputadoLegislatura[]> {
    const legislaturas = await this.deputadoLegislaturaModel.findAll({
      where: { legislaturaId },
    });
    return legislaturas.map((legislatura) => this.convert(legislatura));
  }

  async findByPartidoId(partidoId: number): Promise<DeputadoLegislatura[]> {
    const legislaturas = await this.deputadoLegislaturaModel.findAll({
      where: { partidoId },
    });
    return legislaturas.map((legislatura) => this.convert(legislatura));
  }

  async findOne(
    deputadoId: number,
    legislaturaId: number,
    partidoId: number,
  ): Promise<DeputadoLegislatura | null> {
    const legislatura = await this.deputadoLegislaturaModel.findOne({
      where: { deputadoId, legislaturaId, partidoId },
    });
    return legislatura ? this.convert(legislatura) : null;
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await this.deputadoLegislaturaModel.destroy({
      where: { id },
    });
    return affectedCount > 0;
  }

  async deleteByDeputadoId(deputadoId: number): Promise<number> {
    return await this.deputadoLegislaturaModel.destroy({
      where: { deputadoId },
    });
  }
}
