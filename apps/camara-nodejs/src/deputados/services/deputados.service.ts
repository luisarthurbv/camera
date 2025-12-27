import { Injectable } from '@nestjs/common';
import { DeputadosRepository } from '@deputados/repository/deputados.repository';
import { Deputado } from '@deputados/domain/deputado';

@Injectable()
export class DeputadosService {
  constructor(private readonly deputadosRepository: DeputadosRepository) {}

  async findAll(): Promise<Deputado[]> {
    return this.deputadosRepository.findAll();
  }

  async findById(id: number): Promise<Deputado | null> {
    return this.deputadosRepository.findById(id);
  }

  async findByCpf(cpf: string): Promise<Deputado | null> {
    return this.deputadosRepository.findByCpf(cpf);
  }

  async findByNomeCivil(nomeCivil: string): Promise<Deputado[]> {
    return this.deputadosRepository.findByNomeCivil(nomeCivil);
  }

  async findByUf(uf: string): Promise<Deputado[]> {
    return this.deputadosRepository.findByUf(uf);
  }

  async create(deputadoData: Deputado): Promise<Deputado> {
    return this.deputadosRepository.create(deputadoData);
  }

  async update(
    id: number,
    deputadoData: Partial<Omit<Deputado, 'id'>>,
  ): Promise<Deputado | null> {
    return this.deputadosRepository.update(id, deputadoData);
  }

  async delete(id: number): Promise<boolean> {
    return this.deputadosRepository.delete(id);
  }
}
