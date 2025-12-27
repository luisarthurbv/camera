import { Injectable } from '@nestjs/common';
import { OrgaosRepository } from '@orgaos/repository/orgaos.repository';
import { Orgao } from '@orgaos/domain/orgao';

@Injectable()
export class OrgaosService {
  constructor(private readonly orgaosRepository: OrgaosRepository) {}

  async findAll(): Promise<Orgao[]> {
    return this.orgaosRepository.findAll();
  }

  async findById(id: number): Promise<Orgao | null> {
    return this.orgaosRepository.findById(id);
  }

  async findByName(nome: string): Promise<Orgao | null> {
    return this.orgaosRepository.findByName(nome);
  }

  async findBySigla(sigla: string): Promise<Orgao | null> {
    return this.orgaosRepository.findBySigla(sigla);
  }

  async create(orgaoData: Orgao): Promise<Orgao> {
    return this.orgaosRepository.create(orgaoData);
  }
}
