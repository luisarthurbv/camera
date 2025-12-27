import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { MembrosService } from '@membros/services/membros.service';
import { Membro } from '@membros/domain/membro';

@Controller('membros')
export class MembrosController {
  constructor(private readonly membrosService: MembrosService) {}

  // Local database endpoints
  @Get()
  async getAll(): Promise<Membro[]> {
    return this.membrosService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Membro> {
    const item = await this.membrosService.findById(id);
    if (!item) {
      throw new NotFoundException(`Membro with ID ${id} not found`);
    }
    return item;
  }
}
