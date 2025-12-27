import { Injectable } from '@nestjs/common';
import { PartidosRepository } from '@partidos/repository/partidos.repository';
import { Partido } from '@partidos/domain/partido';

@Injectable()
export class PartidosService {
  constructor(private readonly partidosRepository: PartidosRepository) {}

  async findAll(): Promise<Partido[]> {
    return this.partidosRepository.findAll();
  }

  async findById(id: number): Promise<Partido | null> {
    return this.partidosRepository.findById(id);
  }

  async findByName(nome: string): Promise<Partido | null> {
    return this.partidosRepository.findByName(nome);
  }

  async findBySigla(sigla: string): Promise<Partido | null> {
    return this.partidosRepository.findBySigla(sigla);
  }

  async create(partidoData: Partido): Promise<Partido> {
    return this.partidosRepository.create(partidoData);
  }
}
