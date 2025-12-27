import { Injectable } from '@nestjs/common';
import { LegislaturasRepository } from '@legislaturas/repository/legislaturas.repository';
import { Legislatura } from '@legislaturas/domain/legislatura';

@Injectable()
export class LegislaturasService {
  constructor(
    private readonly legislaturasRepository: LegislaturasRepository,
  ) {}

  async findAll(): Promise<Legislatura[]> {
    return this.legislaturasRepository.findAll();
  }

  async findById(id: number): Promise<Legislatura | null> {
    return this.legislaturasRepository.findById(id);
  }

  async create(data: Legislatura): Promise<Legislatura> {
    return this.legislaturasRepository.create(data);
  }
}
