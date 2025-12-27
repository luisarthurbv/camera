// Common types for the Câmara dos Deputados API

export interface ApiResponse<T> {
  dados: T[];
  links?: Link[];
}

export interface Link {
  rel: string;
  href: string;
}

export interface Referencia {
  id?: number;
  sigla?: string;
  nome?: string;
  descricao?: string;
  uri?: string;
}

export interface PaginationParams {
  pagina?: number;
  itens?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: string;
}

export interface DateRangeParams {
  dataInicio?: string; // YYYY-MM-DD format
  dataFim?: string; // YYYY-MM-DD format
}

export interface LegislaturaParams {
  idLegislatura?: number;
}

// Base query parameters that can be used across different endpoints
export interface BaseQueryParams
  extends PaginationParams,
    DateRangeParams,
    LegislaturaParams {
  formato?: 'json' | 'xml';
}
