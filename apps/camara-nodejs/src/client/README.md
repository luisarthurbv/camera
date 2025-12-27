# Câmara dos Deputados API Client

A comprehensive TypeScript client for the Brazilian Chamber of Deputies (Câmara dos Deputados) Open Data API.

## Features

- **Full TypeScript Support**: Complete type definitions for all API endpoints and responses
- **NestJS Integration**: Injectable service ready for use in NestJS applications
- **Comprehensive Coverage**: All major endpoints including deputies, propositions, events, parties, and more
- **Error Handling**: Built-in error handling and request/response interceptors
- **Configurable**: Customizable base URL, timeout, and other settings
- **REST Controller**: Ready-to-use controller exposing API endpoints

## Installation

The client is already included in this NestJS application. The required dependencies are:

```bash
npm install axios @nestjs/common @nestjs/config
```

## Usage

### Basic Service Usage

```typescript
import { Injectable } from '@nestjs/common';
import { CamaraApiService } from './client/services/api-client.service';

@Injectable()
export class MyService {
  constructor(private readonly camaraApi: CamaraApiService) {}

  async getDeputies() {
    const response = await this.camaraApi.getDeputados({
      pagina: 1,
      itens: 50,
      ordem: 'ASC',
      ordenarPor: 'nome'
    });
    
    return response.dados;
  }
}
```

### Using the REST Controller

The client includes a REST controller that exposes all API endpoints. Once the application is running, you can access:

- `GET /api/camara/deputados` - List deputies
- `GET /api/camara/deputados/:id` - Get deputy details
- `GET /api/camara/deputados/:id/despesas` - Get deputy expenses
- `GET /api/camara/proposicoes` - List propositions
- `GET /api/camara/eventos` - List events
- And many more...

### Configuration

You can configure the API client using environment variables:

```env
CAMARA_API_BASE_URL=https://dadosabertos.camara.leg.br/api/v2
CAMARA_API_TIMEOUT=30000
```

## Available Endpoints

### Deputies (Deputados)
- `getDeputados()` - List deputies with filters
- `getDeputado(id)` - Get deputy details
- `getDeputadoDespesas()` - Get deputy expenses
- `getDeputadoDiscursos()` - Get deputy speeches
- `getDeputadoEventos()` - Get deputy events
- `getDeputadoFrente()` - Get deputy parliamentary fronts
- `getDeputadoHistorico()` - Get deputy history
- `getDeputadoMandatosExternos()` - Get deputy external mandates
- `getDeputadoOcupacoes()` - Get deputy occupations
- `getDeputadoOrgaos()` - Get deputy organs
- `getDeputadoProfissoes()` - Get deputy professions

### Propositions (Proposições)
- `getProposicoes()` - List propositions
- `getProposicao(id)` - Get proposition details
- `getProposicaoAutores()` - Get proposition authors
- `getProposicaoRelacionadas()` - Get related propositions
- `getProposicaoTemas()` - Get proposition themes
- `getProposicaoTramitacoes()` - Get proposition procedures
- `getProposicaoVotacoes()` - Get proposition votes

### Events (Eventos)
- `getEventos()` - List events
- `getEvento(id)` - Get event details
- `getEventoDeputados()` - Get event deputies

### Other Endpoints
- `getBlocos()` - Parliamentary blocks
- `getPartidos()` - Political parties
- `getOrgaos()` - Organs
- `getLegislaturas()` - Legislatures
- `getFrentes()` - Parliamentary fronts
- `getVotacoes()` - Votings

## Examples

### Get Current Deputies
```typescript
const deputies = await camaraApi.getDeputados({
  pagina: 1,
  itens: 50,
  ordem: 'ASC',
  ordenarPor: 'nome'
});

console.log(`Found ${deputies.dados.length} deputies`);
```

### Get Deputy Expenses
```typescript
const expenses = await camaraApi.getDeputadoDespesas({
  idDeputado: 123456,
  ano: 2024,
  mes: 1,
  pagina: 1,
  itens: 20
});

expenses.dados.forEach(expense => {
  console.log(`${expense.tipoDespesa}: R$ ${expense.valorDocumento}`);
});
```

### Search Propositions
```typescript
const propositions = await camaraApi.getProposicoes({
  keywords: 'educação',
  ano: 2024,
  pagina: 1,
  itens: 10
});
```

### Get Upcoming Events
```typescript
const today = new Date().toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const events = await camaraApi.getEventos({
  dataInicio: today,
  dataFim: nextWeek,
  pagina: 1,
  itens: 20
});
```

## Type Definitions

The client includes comprehensive TypeScript definitions for all API responses:

```typescript
interface Deputado {
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  idLegislatura: number;
  urlFoto: string;
  email?: string;
}

interface DeputadoDespesa {
  ano: number;
  mes: number;
  tipoDespesa: string;
  valorDocumento: number;
  nomeFornecedor: string;
  // ... more fields
}
```

## Error Handling

The client includes built-in error handling:

```typescript
try {
  const response = await camaraApi.getDeputados();
  return response.dados;
} catch (error) {
  console.error('API request failed:', error.message);
  throw error;
}
```

## API Documentation

For complete API documentation, visit: https://dadosabertos.camara.leg.br/swagger/api.html

## License

This client is part of the Camara NestJS application and follows the same license.
