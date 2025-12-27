import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CamaraApiService } from '@client/api-client.service';
import { ApiResponse, Partido, Deputado, BaseQueryParams } from '@client/types';

@Controller('partidos')
export class PartidosController {
  constructor(private readonly camaraApiService: CamaraApiService) {}

  @Get()
  async getPartidos(
    @Query() query: BaseQueryParams,
  ): Promise<ApiResponse<Partido>> {
    return this.camaraApiService.getPartidos(query);
  }

  @Get(':id')
  async getPartido(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Partido>> {
    return this.camaraApiService.getPartido(id);
  }

  @Get(':id/membros')
  async getPartidoMembros(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: BaseQueryParams,
  ): Promise<ApiResponse<Deputado>> {
    return this.camaraApiService.getPartidoMembros(id, query);
  }
}
