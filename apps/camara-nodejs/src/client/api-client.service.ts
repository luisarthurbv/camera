import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  ApiResponse,
  Deputado,
  DeputadoDetalhado,
  DeputadoDespesa,
  DeputadoDiscurso,
  DeputadoEvento,
  DeputadoFrente,
  DeputadoHistorico,
  DeputadoMandatoExterno,
  DeputadoOcupacao,
  DeputadoOrgao,
  DeputadoProfissao,
  DeputadosQueryParams,
  DeputadoDespesasQueryParams,
  DeputadoDiscursosQueryParams,
  Proposicao,
  ProposicaoDetalhada,
  ProposicaoAutor,
  ProposicaoRelacionada,
  ProposicaoTema,
  ProposicaoTramitacao,
  ProposicaoVotacao,
  ProposicoesQueryParams,
  Evento,
  EventoDetalhado,
  EventoDeputado,
  EventosQueryParams,
  Bloco,
  Partido,
  Orgao,
  Legislatura,
  Frente,
  Votacao,
  VotoDeputado,
  BaseQueryParams,
} from './types';

export interface CamaraApiConfig {
  baseURL?: string;
  timeout?: number;
  defaultFormat?: 'json' | 'xml';
}

@Injectable()
export class CamaraApiService {
  private readonly httpClient: AxiosInstance;
  private readonly baseURL = 'https://dadosabertos.camara.leg.br/api/v2';

  constructor(config?: CamaraApiConfig) {
    this.httpClient = axios.create({
      baseURL: config?.baseURL || this.baseURL,
      timeout: config?.timeout || 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.httpClient.interceptors.request.use(
      (config) => {
        console.log(`Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.httpClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API request failed:', error.message);
        return Promise.reject(error);
      },
    );
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return searchParams.toString();
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    const response = await this.httpClient.get<ApiResponse<T>>(url);
    return response.data;
  }

  // DEPUTADOS ENDPOINTS

  /**
   * Lista deputados com filtros opcionais
   */
  async getDeputados(
    params?: DeputadosQueryParams,
  ): Promise<ApiResponse<Deputado>> {
    return this.request<Deputado>('/deputados', params);
  }

  /**
   * Obtém detalhes de um deputado específico
   */
  async getDeputado(id: number): Promise<ApiResponse<DeputadoDetalhado>> {
    return this.request<DeputadoDetalhado>(`/deputados/${id}`);
  }

  /**
   * Lista despesas de um deputado
   */
  async getDeputadoDespesas(
    params: DeputadoDespesasQueryParams,
  ): Promise<ApiResponse<DeputadoDespesa>> {
    const { idDeputado, ...queryParams } = params;
    return this.request<DeputadoDespesa>(
      `/deputados/${idDeputado}/despesas`,
      queryParams,
    );
  }

  /**
   * Lista discursos de um deputado
   */
  async getDeputadoDiscursos(
    params: DeputadoDiscursosQueryParams,
  ): Promise<ApiResponse<DeputadoDiscurso>> {
    const { idDeputado, ...queryParams } = params;
    return this.request<DeputadoDiscurso>(
      `/deputados/${idDeputado}/discursos`,
      queryParams,
    );
  }

  /**
   * Lista eventos de um deputado
   */
  async getDeputadoEventos(
    idDeputado: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<DeputadoEvento>> {
    return this.request<DeputadoEvento>(
      `/deputados/${idDeputado}/eventos`,
      params,
    );
  }

  /**
   * Lista frentes parlamentares de um deputado
   */
  async getDeputadoFrente(
    idDeputado: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<DeputadoFrente>> {
    return this.request<DeputadoFrente>(
      `/deputados/${idDeputado}/frentes`,
      params,
    );
  }

  /**
   * Histórico de um deputado
   */
  async getDeputadoHistorico(
    idDeputado: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<DeputadoHistorico>> {
    return this.request<DeputadoHistorico>(
      `/deputados/${idDeputado}/historico`,
      params,
    );
  }

  /**
   * Mandatos externos de um deputado
   */
  async getDeputadoMandatosExternos(
    idDeputado: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<DeputadoMandatoExterno>> {
    return this.request<DeputadoMandatoExterno>(
      `/deputados/${idDeputado}/mandatosExternos`,
      params,
    );
  }

  /**
   * Ocupações de um deputado
   */
  async getDeputadoOcupacoes(
    idDeputado: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<DeputadoOcupacao>> {
    return this.request<DeputadoOcupacao>(
      `/deputados/${idDeputado}/ocupacoes`,
      params,
    );
  }

  /**
   * Órgãos de um deputado
   */
  async getDeputadoOrgaos(
    idDeputado: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<DeputadoOrgao>> {
    return this.request<DeputadoOrgao>(
      `/deputados/${idDeputado}/orgaos`,
      params,
    );
  }

  /**
   * Profissões de um deputado
   */
  async getDeputadoProfissoes(
    idDeputado: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<DeputadoProfissao>> {
    return this.request<DeputadoProfissao>(
      `/deputados/${idDeputado}/profissoes`,
      params,
    );
  }

  // PROPOSIÇÕES ENDPOINTS

  /**
   * Lista proposições com filtros opcionais
   */
  async getProposicoes(
    params?: ProposicoesQueryParams,
  ): Promise<ApiResponse<Proposicao>> {
    return this.request<Proposicao>('/proposicoes', params);
  }

  /**
   * Obtém detalhes de uma proposição específica
   */
  async getProposicao(id: number): Promise<ApiResponse<ProposicaoDetalhada>> {
    return this.request<ProposicaoDetalhada>(`/proposicoes/${id}`);
  }

  /**
   * Lista autores de uma proposição
   */
  async getProposicaoAutores(
    idProposicao: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<ProposicaoAutor>> {
    return this.request<ProposicaoAutor>(
      `/proposicoes/${idProposicao}/autores`,
      params,
    );
  }

  /**
   * Lista proposições relacionadas
   */
  async getProposicaoRelacionadas(
    idProposicao: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<ProposicaoRelacionada>> {
    return this.request<ProposicaoRelacionada>(
      `/proposicoes/${idProposicao}/relacionadas`,
      params,
    );
  }

  /**
   * Lista temas de uma proposição
   */
  async getProposicaoTemas(
    idProposicao: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<ProposicaoTema>> {
    return this.request<ProposicaoTema>(
      `/proposicoes/${idProposicao}/temas`,
      params,
    );
  }

  /**
   * Lista tramitações de uma proposição
   */
  async getProposicaoTramitacoes(
    idProposicao: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<ProposicaoTramitacao>> {
    return this.request<ProposicaoTramitacao>(
      `/proposicoes/${idProposicao}/tramitacoes`,
      params,
    );
  }

  /**
   * Lista votações de uma proposição
   */
  async getProposicaoVotacoes(
    idProposicao: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<ProposicaoVotacao>> {
    return this.request<ProposicaoVotacao>(
      `/proposicoes/${idProposicao}/votacoes`,
      params,
    );
  }

  // EVENTOS ENDPOINTS

  /**
   * Lista eventos com filtros opcionais
   */
  async getEventos(params?: EventosQueryParams): Promise<ApiResponse<Evento>> {
    return this.request<Evento>('/eventos', params);
  }

  /**
   * Obtém detalhes de um evento específico
   */
  async getEvento(id: number): Promise<ApiResponse<EventoDetalhado>> {
    return this.request<EventoDetalhado>(`/eventos/${id}`);
  }

  /**
   * Lista deputados de um evento
   */
  async getEventoDeputados(
    idEvento: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<EventoDeputado>> {
    return this.request<EventoDeputado>(
      `/eventos/${idEvento}/deputados`,
      params,
    );
  }

  // OUTROS ENDPOINTS

  /**
   * Lista blocos parlamentares
   */
  async getBlocos(params?: BaseQueryParams): Promise<ApiResponse<Bloco>> {
    return this.request<Bloco>('/blocos', params);
  }

  /**
   * Obtém detalhes de um bloco específico
   */
  async getBloco(id: number): Promise<ApiResponse<Bloco>> {
    return this.request<Bloco>(`/blocos/${id}`);
  }

  /**
   * Lista partidos
   */
  async getPartidos(params?: BaseQueryParams): Promise<ApiResponse<Partido>> {
    return this.request<Partido>('/partidos', params);
  }

  /**
   * Obtém detalhes de um partido específico
   */
  async getPartido(id: number): Promise<ApiResponse<Partido>> {
    return this.request<Partido>(`/partidos/${id}`);
  }

  /**
   * Lista membros de um partido
   */
  async getPartidoMembros(
    idPartido: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<Deputado>> {
    return this.request<Deputado>(`/partidos/${idPartido}/membros`, params);
  }

  /**
   * Lista órgãos
   */
  async getOrgaos(params?: BaseQueryParams): Promise<ApiResponse<Orgao>> {
    return this.request<Orgao>('/orgaos', params);
  }

  /**
   * Obtém detalhes de um órgão específico
   */
  async getOrgao(id: number): Promise<ApiResponse<Orgao>> {
    return this.request<Orgao>(`/orgaos/${id}`);
  }

  /**
   * Lista membros de um órgão
   */
  async getOrgaoMembros(
    idOrgao: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<Deputado>> {
    return this.request<Deputado>(`/orgaos/${idOrgao}/membros`, params);
  }

  /**
   * Lista legislaturas
   */
  async getLegislaturas(
    params?: BaseQueryParams,
  ): Promise<ApiResponse<Legislatura>> {
    return this.request<Legislatura>('/legislaturas', params);
  }

  /**
   * Obtém detalhes de uma legislatura específica
   */
  async getLegislatura(id: number): Promise<ApiResponse<Legislatura>> {
    return this.request<Legislatura>(`/legislaturas/${id}`);
  }

  /**
   * Lista frentes parlamentares
   */
  async getFrentes(params?: BaseQueryParams): Promise<ApiResponse<Frente>> {
    return this.request<Frente>('/frentes', params);
  }

  /**
   * Obtém detalhes de uma frente específica
   */
  async getFrente(id: number): Promise<ApiResponse<Frente>> {
    return this.request<Frente>(`/frentes/${id}`);
  }

  /**
   * Lista membros de uma frente
   */
  async getFrenteMembros(
    idFrente: number,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<Deputado>> {
    return this.request<Deputado>(`/frentes/${idFrente}/membros`, params);
  }

  /**
   * Lista votações
   */
  async getVotacoes(params?: BaseQueryParams): Promise<ApiResponse<Votacao>> {
    return this.request<Votacao>('/votacoes', params);
  }

  /**
   * Obtém detalhes de uma votação específica
   */
  async getVotacao(id: string): Promise<ApiResponse<Votacao>> {
    return this.request<Votacao>(`/votacoes/${id}`);
  }

  /**
   * Lista votos de uma votação
   */
  async getVotacaoVotos(
    idVotacao: string,
    params?: BaseQueryParams,
  ): Promise<ApiResponse<VotoDeputado>> {
    return this.request<VotoDeputado>(`/votacoes/${idVotacao}/votos`, params);
  }
}
