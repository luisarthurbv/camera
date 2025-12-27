import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { DeputadoModel } from '../models/deputado.model';
import { ProfissaoModel } from '../models/profissao.model';
import { OcupacaoModel } from '../models/ocupacao.model';
import { Deputado, DeputadoCompleto } from '../domain/deputado';
import { DeputadoLegislaturaModel } from '../models/deputado-legislatura.model';

@Injectable()
export class DeputadosRepository {
  constructor(
    @InjectModel(DeputadoModel)
    private deputadoModel: typeof DeputadoModel,
  ) {}

  private convert(deputadoModel: DeputadoModel): Deputado {
    return {
      id: deputadoModel.id,
      cpf: deputadoModel.cpf,
      nomeCivil: deputadoModel.nomeCivil,
      nome: deputadoModel.nome,
      sexo: deputadoModel.sexo,
      dataNascimento: deputadoModel.dataNascimento,
      dataFalecimento: deputadoModel.dataFalecimento,
      ufNascimento: deputadoModel.ufNascimento,
      municipioNascimento: deputadoModel.municipioNascimento,
      redesSociais: deputadoModel.redesSociais,
      website: deputadoModel.website,
    };
  }

  private convertCompleto(deputadoModel: DeputadoModel): DeputadoCompleto {
    return {
      ...this.convert(deputadoModel),
      profissoes: (deputadoModel.profissoes || []).map((p) => ({
        id: p.id,
        titulo: p.titulo,
      })),
      ocupacoes: (deputadoModel.ocupacoes || []).map((o) => ({
        id: o.id,
        titulo: o.titulo,
        entidade: o.entidade,
      })),
      deputadoLegislaturas: (deputadoModel.legislaturas || []).map((l) => ({
        id: l.id,
        deputadoId: l.deputadoId,
        legislaturaId: l.legislaturaId,
        partidoId: l.partidoId,
        startDate: l.startDate,
        endDate: l.endDate,
        estado: l.estado,
      })),
    };
  }

  async findAll(): Promise<Deputado[]> {
    const deputados = await this.deputadoModel.findAll();
    return deputados.map((deputado) => this.convert(deputado));
  }

  async findById(id: number): Promise<Deputado | null> {
    const deputado = await this.deputadoModel.findByPk(id);
    if (!deputado) return null;

    return this.convert(deputado);
  }

  async findByCpf(cpf: string): Promise<Deputado | null> {
    const deputado = await this.deputadoModel.findOne({ where: { cpf } });
    if (!deputado) return null;

    return this.convert(deputado);
  }

  async findByNomeCivil(nomeCivil: string): Promise<Deputado[]> {
    const deputados = await this.deputadoModel.findAll({
      where: { nomeCivil: { [Op.iLike]: `%${nomeCivil}%` } },
    });
    return deputados.map((deputado) => this.convert(deputado));
  }

  async findByUf(uf: string): Promise<Deputado[]> {
    const deputados = await this.deputadoModel.findAll({
      where: { ufNascimento: uf },
    });
    return deputados.map((deputado) => this.convert(deputado));
  }

  async create(deputadoData: Deputado): Promise<Deputado> {
    const deputado = await this.deputadoModel.create(deputadoData);
    return this.convert(deputado);
  }

  async update(
    id: number,
    deputadoData: Partial<Omit<Deputado, 'id'>>,
  ): Promise<Deputado | null> {
    const [affectedCount] = await this.deputadoModel.update(deputadoData, {
      where: { id },
    });

    if (affectedCount === 0) return null;

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const affectedCount = await this.deputadoModel.destroy({
      where: { id },
    });

    return affectedCount > 0;
  }

  async findAllCompleto(): Promise<DeputadoCompleto[]> {
    const deputados = await this.deputadoModel.findAll({
      include: [
        { model: ProfissaoModel, as: 'profissoes' },
        { model: OcupacaoModel, as: 'ocupacoes' },
      ],
    });
    return deputados.map((deputado) => this.convertCompleto(deputado));
  }

  async findByIdCompleto(id: number): Promise<DeputadoCompleto | null> {
    const deputado = await this.deputadoModel.findByPk(id, {
      include: [
        { model: ProfissaoModel, as: 'profissoes' },
        { model: OcupacaoModel, as: 'ocupacoes' },
        { model: DeputadoLegislaturaModel, as: 'deputadoLegislaturas' },
      ],
    });
    if (!deputado) return null;

    return this.convertCompleto(deputado);
  }
}
