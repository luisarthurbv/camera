import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MembroModel } from '@membros/models/membro.model';
import { Membro } from '@membros/domain/membro';

@Injectable()
export class MembrosRepository {
  constructor(
    @InjectModel(MembroModel)
    private readonly membroModel: typeof MembroModel,
  ) {}

  private convert(model: MembroModel): Membro {
    return {
      id: model.id,
      deputadoId: model.deputadoId,
      partidoId: model.partidoId,
      legislaturaId: model.legislaturaId,
    };
  }

  async findAll(): Promise<Membro[]> {
    const rows = await this.membroModel.findAll();
    return rows.map((r) => this.convert(r));
  }

  async findById(id: string): Promise<Membro | null> {
    const row = await this.membroModel.findByPk(id);
    return row ? this.convert(row) : null;
  }

  async create(data: Omit<Membro, 'id'>): Promise<Membro> {
    const row = await this.membroModel.create(data as any);
    return this.convert(row);
  }

  async findOneByKeys(
    deputadoId: number,
    partidoId: number,
    legislaturaId: number,
  ): Promise<Membro | null> {
    const row = await this.membroModel.findOne({
      where: { deputadoId, partidoId, legislaturaId },
    });
    return row ? this.convert(row) : null;
  }
}
