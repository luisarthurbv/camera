import { Injectable } from '@nestjs/common';
import { MembrosRepository } from '@membros/repository/membros.repository';
import { Membro } from '@membros/domain/membro';

@Injectable()
export class MembrosService {
  constructor(private readonly membrosRepository: MembrosRepository) {}

  async findAll(): Promise<Membro[]> {
    return this.membrosRepository.findAll();
  }

  async findById(id: string): Promise<Membro | null> {
    return this.membrosRepository.findById(id);
  }

  async create(data: Omit<Membro, 'id'>): Promise<Membro> {
    return this.membrosRepository.create(data);
  }
}
