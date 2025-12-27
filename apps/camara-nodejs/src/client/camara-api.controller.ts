import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CamaraApiService } from './api-client.service';
import {
  ApiResponse,
  Deputado,
  DeputadoDetalhado,
  DeputadoDespesa,
  Proposicao,
  Evento,
  Partido,
  DeputadosQueryParams,
  ProposicoesQueryParams,
  EventosQueryParams,
} from './types';

@Controller('client/camara')
export class CamaraApiController {
  constructor(private readonly camaraApiService: CamaraApiService) {}

  @Get('deputados')
  async getDeputados(
    @Query() query: DeputadosQueryParams,
  ): Promise<ApiResponse<Deputado>> {
    return this.camaraApiService.getDeputados(query);
  }

  @Get('deputados/:id')
  async getDeputado(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<DeputadoDetalhado>> {
    return this.camaraApiService.getDeputado(id);
  }

  @Get('deputados/:id/despesas')
  async getDeputadoDespesas(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ): Promise<ApiResponse<DeputadoDespesa>> {
    return this.camaraApiService.getDeputadoDespesas({
      idDeputado: id,
      ...query,
    });
  }

  @Get('deputados/:id/discursos')
  async getDeputadoDiscursos(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ) {
    return this.camaraApiService.getDeputadoDiscursos({
      idDeputado: id,
      ...query,
    });
  }

  @Get('deputados/:id/eventos')
  async getDeputadoEventos(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ) {
    return this.camaraApiService.getDeputadoEventos(id, query);
  }

  @Get('proposicoes')
  async getProposicoes(
    @Query() query: ProposicoesQueryParams,
  ): Promise<ApiResponse<Proposicao>> {
    return this.camaraApiService.getProposicoes(query);
  }

  @Get('proposicoes/:id')
  async getProposicao(@Param('id', ParseIntPipe) id: number) {
    return this.camaraApiService.getProposicao(id);
  }

  @Get('proposicoes/:id/autores')
  async getProposicaoAutores(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ) {
    return this.camaraApiService.getProposicaoAutores(id, query);
  }

  @Get('proposicoes/:id/tramitacoes')
  async getProposicaoTramitacoes(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ) {
    return this.camaraApiService.getProposicaoTramitacoes(id, query);
  }

  @Get('eventos')
  async getEventos(
    @Query() query: EventosQueryParams,
  ): Promise<ApiResponse<Evento>> {
    return this.camaraApiService.getEventos(query);
  }

  @Get('eventos/:id')
  async getEvento(@Param('id', ParseIntPipe) id: number) {
    return this.camaraApiService.getEvento(id);
  }

  @Get('eventos/:id/deputados')
  async getEventoDeputados(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ) {
    return this.camaraApiService.getEventoDeputados(id, query);
  }

  @Get('partidos')
  async getPartidos(@Query() query: any): Promise<ApiResponse<Partido>> {
    return this.camaraApiService.getPartidos(query);
  }

  @Get('partidos/:id')
  async getPartido(@Param('id', ParseIntPipe) id: number) {
    return this.camaraApiService.getPartido(id);
  }

  @Get('partidos/:id/membros')
  async getPartidoMembros(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ) {
    return this.camaraApiService.getPartidoMembros(id, query);
  }

  @Get('orgaos')
  async getOrgaos(@Query() query: any) {
    return this.camaraApiService.getOrgaos(query);
  }

  @Get('orgaos/:id')
  async getOrgao(@Param('id', ParseIntPipe) id: number) {
    return this.camaraApiService.getOrgao(id);
  }

  @Get('legislaturas')
  async getLegislaturas(@Query() query: any) {
    return this.camaraApiService.getLegislaturas(query);
  }

  @Get('votacoes')
  async getVotacoes(@Query() query: any) {
    return this.camaraApiService.getVotacoes(query);
  }

  @Get('votacoes/:id')
  async getVotacao(@Param('id') id: string) {
    return this.camaraApiService.getVotacao(id);
  }

  @Get('votacoes/:id/votos')
  async getVotacaoVotos(@Param('id') id: string, @Query() query: any) {
    return this.camaraApiService.getVotacaoVotos(id, query);
  }
}
