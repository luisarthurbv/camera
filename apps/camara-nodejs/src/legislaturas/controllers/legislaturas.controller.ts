import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { LegislaturasService } from '@legislaturas/services/legislaturas.service';
import { Legislatura } from '@legislaturas/domain/legislatura';

@Controller('legislaturas')
export class LegislaturasController {
  constructor(private readonly legislaturasService: LegislaturasService) {}

  // Local database endpoints
  @Get()
  async getAll(): Promise<Legislatura[]> {
    return this.legislaturasService.findAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Legislatura> {
    const item = await this.legislaturasService.findById(id);
    if (!item) {
      throw new NotFoundException(`Legislatura with ID ${id} not found`);
    }
    return item;
  }
}
