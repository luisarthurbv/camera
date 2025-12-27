import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PartidoModel } from '@partidos/models/partido.model';
import { Partido } from '@partidos/domain/partido';

@Injectable()
export class PartidosRepository {
  constructor(
    @InjectModel(PartidoModel)
    private partidoModel: typeof PartidoModel,
  ) {}

  private convert(partidoModel: PartidoModel): Partido {
    return {
      id: partidoModel.id,
      nome: partidoModel.nome,
      sigla: partidoModel.sigla,
    };
  }

  async findAll(): Promise<Partido[]> {
    const partidos = await this.partidoModel.findAll();
    return partidos.map((partido) => this.convert(partido));
  }

  async findById(id: number): Promise<Partido | null> {
    const partido = await this.partidoModel.findByPk(id);
    if (!partido) return null;

    return this.convert(partido);
  }

  async findByName(nome: string): Promise<Partido | null> {
    const partido = await this.partidoModel.findOne({ where: { nome } });
    if (!partido) return null;

    return this.convert(partido);
  }

  async findBySigla(sigla: string): Promise<Partido | null> {
    const partido = await this.partidoModel.findOne({ where: { sigla } });
    if (!partido) return null;

    return this.convert(partido);
  }

  async create(partidoData: Partido): Promise<Partido> {
    const partido = await this.partidoModel.create(partidoData);
    return this.convert(partido);
  }
}
