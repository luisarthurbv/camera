import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfissaoModel } from '@deputados/models/profissao.model';
import { Profissao } from '@deputados/domain/profissao';

@Injectable()
export class ProfissoesRepository {
  constructor(
    @InjectModel(ProfissaoModel)
    private profissaoModel: typeof ProfissaoModel,
  ) {}

  private convert(profissaoModel: ProfissaoModel): Profissao {
    return {
      id: profissaoModel.id,
      titulo: profissaoModel.titulo,
    };
  }

  async create(deputadoId: number, titulo: string): Promise<Profissao> {
    const profissao = await this.profissaoModel.create({
      deputadoId,
      titulo,
    });
    return this.convert(profissao);
  }

  async findByDeputadoId(deputadoId: number): Promise<Profissao[]> {
    const profissoes = await this.profissaoModel.findAll({
      where: { deputadoId },
    });
    return profissoes.map((profissao) => this.convert(profissao));
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await this.profissaoModel.destroy({
      where: { id },
    });
    return affectedCount > 0;
  }

  async deleteByDeputadoId(deputadoId: number): Promise<number> {
    return await this.profissaoModel.destroy({
      where: { deputadoId },
    });
  }
}
