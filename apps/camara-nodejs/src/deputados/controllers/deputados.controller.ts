import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CamaraApiService } from '@client/api-client.service';
import { DeputadosService } from '@deputados/services/deputados.service';
import {
  ApiResponse,
  Deputado as ApiDeputado,
  DeputadosQueryParams,
  BaseQueryParams,
  DeputadoDespesasQueryParams,
  DeputadoDiscursosQueryParams,
} from '@client/types';
import { Deputado } from '@deputados/domain/deputado';

@Controller('deputados')
export class DeputadosController {
  constructor(
    private readonly camaraApiService: CamaraApiService,
    private readonly deputadosService: DeputadosService,
  ) {}

  // External API endpoints (Câmara API)
  @Get('api')
  async getDeputadosFromApi(
    @Query() query: DeputadosQueryParams,
  ): Promise<ApiResponse<ApiDeputado>> {
    return this.camaraApiService.getDeputados(query);
  }

  @Get('api/:id')
  async getDeputadoFromApi(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ApiDeputado>> {
    return this.camaraApiService.getDeputado(id);
  }

  @Get('api/:id/despesas')
  async getDeputadoDespesas(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: Omit<DeputadoDespesasQueryParams, 'idDeputado'>,
  ) {
    return this.camaraApiService.getDeputadoDespesas({
      idDeputado: id,
      ...query,
    });
  }

  @Get('api/:id/discursos')
  async getDeputadoDiscursos(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: Omit<DeputadoDiscursosQueryParams, 'idDeputado'>,
  ) {
    return this.camaraApiService.getDeputadoDiscursos({
      idDeputado: id,
      ...query,
    });
  }

  @Get('api/:id/eventos')
  async getDeputadoEventos(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: BaseQueryParams,
  ) {
    return this.camaraApiService.getDeputadoEventos(id, query);
  }

  // Local database endpoints
  @Get()
  async getAllDeputados(): Promise<Deputado[]> {
    return this.deputadosService.findAll();
  }

  @Get('search/cpf/:cpf')
  async getDeputadoByCpf(@Param('cpf') cpf: string): Promise<Deputado> {
    const deputado = await this.deputadosService.findByCpf(cpf);
    if (!deputado) {
      throw new NotFoundException(`Deputado with CPF ${cpf} not found`);
    }
    return deputado;
  }

  @Get('search/nome/:nome')
  async getDeputadosByNome(@Param('nome') nome: string): Promise<Deputado[]> {
    return this.deputadosService.findByNomeCivil(nome);
  }

  @Get('search/uf/:uf')
  async getDeputadosByUf(@Param('uf') uf: string): Promise<Deputado[]> {
    return this.deputadosService.findByUf(uf);
  }

  @Get(':id')
  async getDeputadoById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Deputado> {
    const deputado = await this.deputadosService.findById(id);
    if (!deputado) {
      throw new NotFoundException(`Deputado with ID ${id} not found`);
    }
    return deputado;
  }
}
