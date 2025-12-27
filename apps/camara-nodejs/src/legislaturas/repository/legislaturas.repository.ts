import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LegislaturaModel } from '@legislaturas/models/legislatura.model';
import { Legislatura } from '@legislaturas/domain/legislatura';

@Injectable()
export class LegislaturasRepository {
  constructor(
    @InjectModel(LegislaturaModel)
    private legislaturaModel: typeof LegislaturaModel,
  ) {}

  private convert(model: LegislaturaModel): Legislatura {
    return {
      id: model.id,
      dataInicio: model.dataInicio,
      dataFim: model.dataFim,
    };
  }

  async findAll(): Promise<Legislatura[]> {
    const rows = await this.legislaturaModel.findAll();
    return rows.map((r) => this.convert(r));
  }

  async findById(id: number): Promise<Legislatura | null> {
    const row = await this.legislaturaModel.findByPk(id);
    return row ? this.convert(row) : null;
  }

  async create(data: Legislatura): Promise<Legislatura> {
    const row = await this.legislaturaModel.create(data as any);
    return this.convert(row);
  }
}
