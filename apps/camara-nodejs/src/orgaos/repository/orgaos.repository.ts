import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrgaoModel } from '@orgaos/models/orgao.model';
import { Orgao } from '@orgaos/domain/orgao';

@Injectable()
export class OrgaosRepository {
  constructor(
    @InjectModel(OrgaoModel)
    private orgaoModel: typeof OrgaoModel,
  ) {}

  private convert(orgaoModel: OrgaoModel): Orgao {
    return {
      id: orgaoModel.id,
      sigla: orgaoModel.sigla,
      apelido: orgaoModel.apelido,
      tipo: orgaoModel.tipo,
      nome: orgaoModel.nome,
      casa: orgaoModel.casa,
    };
  }

  async findAll(): Promise<Orgao[]> {
    const orgaos = await this.orgaoModel.findAll();
    return orgaos.map((orgao) => this.convert(orgao));
  }

  async findById(id: number): Promise<Orgao | null> {
    const orgao = await this.orgaoModel.findByPk(id);
    if (!orgao) return null;

    return this.convert(orgao);
  }

  async findByName(nome: string): Promise<Orgao | null> {
    const orgao = await this.orgaoModel.findOne({ where: { nome } });
    if (!orgao) return null;

    return this.convert(orgao);
  }

  async findBySigla(sigla: string): Promise<Orgao | null> {
    const orgao = await this.orgaoModel.findOne({ where: { sigla } });
    if (!orgao) return null;

    return this.convert(orgao);
  }

  async create(orgaoData: Orgao): Promise<Orgao> {
    const orgao = await this.orgaoModel.create(orgaoData);
    return this.convert(orgao);
  }
}
