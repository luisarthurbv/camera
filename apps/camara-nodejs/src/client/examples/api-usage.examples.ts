import { CamaraApiService } from '../api-client.service';

/**
 * Examples of how to use the Câmara API client
 */
export class CamaraApiExamples {
  constructor(private readonly camaraApi: CamaraApiService) {}

  /**
   * Example: Get all deputies from current legislature
   */
  async getCurrentDeputies() {
    try {
      const response = await this.camaraApi.getDeputados({
        pagina: 1,
        itens: 50,
        ordem: 'ASC',
        ordenarPor: 'nome',
      });

      console.log(`Found ${response.dados.length} deputies`);
      response.dados.forEach((deputado) => {
        console.log(
          `${deputado.nome} - ${deputado.siglaPartido}/${deputado.siglaUf}`,
        );
      });

      return response;
    } catch (error) {
      console.error('Error fetching deputies:', error);
      throw error;
    }
  }

  /**
   * Example: Get deputy details and their expenses
   */
  async getDeputyDetailsAndExpenses(deputyId: number) {
    try {
      // Get deputy details
      const deputyResponse = await this.camaraApi.getDeputado(deputyId);
      const deputy = deputyResponse.dados[0];

      console.log(`Deputy: ${deputy.nome}`);
      console.log(`Party: ${deputy.siglaPartido}`);
      console.log(`State: ${deputy.siglaUf}`);

      // Get deputy expenses for current year
      const currentYear = new Date().getFullYear();
      const expensesResponse = await this.camaraApi.getDeputadoDespesas({
        idDeputado: deputyId,
        ano: currentYear,
        pagina: 1,
        itens: 20,
        ordem: 'DESC',
        ordenarPor: 'valorDocumento',
      });

      console.log(`\nTop expenses for ${currentYear}:`);
      expensesResponse.dados.forEach((expense) => {
        console.log(
          `${expense.tipoDespesa}: R$ ${expense.valorDocumento.toFixed(2)} - ${
            expense.nomeFornecedor
          }`,
        );
      });

      return { deputy, expenses: expensesResponse.dados };
    } catch (error) {
      console.error('Error fetching deputy data:', error);
      throw error;
    }
  }

  /**
   * Example: Search for propositions by keyword
   */
  async searchPropositions(keyword: string) {
    try {
      const response = await this.camaraApi.getProposicoes({
        keywords: keyword,
        pagina: 1,
        itens: 10,
        ordem: 'DESC',
        ordenarPor: 'dataApresentacao',
      });

      console.log(
        `Found ${response.dados.length} propositions for keyword: ${keyword}`,
      );
      response.dados.forEach((prop) => {
        console.log(
          `${prop.siglaTipo} ${prop.numero}/${
            prop.ano
          } - ${prop.ementa.substring(0, 100)}...`,
        );
      });

      return response;
    } catch (error) {
      console.error('Error searching propositions:', error);
      throw error;
    }
  }

  /**
   * Example: Get upcoming events
   */
  async getUpcomingEvents() {
    try {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const response = await this.camaraApi.getEventos({
        dataInicio: today.toISOString().split('T')[0],
        dataFim: nextWeek.toISOString().split('T')[0],
        pagina: 1,
        itens: 20,
        ordem: 'ASC',
        ordenarPor: 'dataHoraInicio',
      });

      console.log(`Upcoming events (next 7 days):`);
      response.dados.forEach((event) => {
        const eventDate = new Date(event.dataHoraInicio);
        console.log(`${eventDate.toLocaleDateString()} - ${event.descricao}`);
        console.log(`  Type: ${event.descricaoTipo}`);
        console.log(`  Organs: ${event.orgaos.map((o) => o.sigla).join(', ')}`);
      });

      return response;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  /**
   * Example: Get party information and members
   */
  async getPartyInfo(partyId: number) {
    try {
      // Get party details
      const partyResponse = await this.camaraApi.getPartido(partyId);
      const party = partyResponse.dados[0];

      console.log(`Party: ${party.nome} (${party.sigla})`);
      console.log(`Total members: ${party.status.totalMembros}`);

      if (party.status.lider) {
        console.log(`Leader: ${party.status.lider.nome}`);
      }

      // Get party members
      const membersResponse = await this.camaraApi.getPartidoMembros(partyId, {
        pagina: 1,
        itens: 50,
        ordem: 'ASC',
        ordenarPor: 'nome',
      });

      console.log(`\nParty members:`);
      membersResponse.dados.forEach((member) => {
        console.log(`- ${member.nome} (${member.siglaUf})`);
      });

      return { party, members: membersResponse.dados };
    } catch (error) {
      console.error('Error fetching party info:', error);
      throw error;
    }
  }

  /**
   * Example: Get voting details
   */
  async getVotingDetails(votingId: string) {
    try {
      // Get voting details
      const votingResponse = await this.camaraApi.getVotacao(votingId);
      const voting = votingResponse.dados[0];

      console.log(`Voting: ${voting.titulo}`);
      console.log(`Result: ${voting.descricaoResultado}`);
      console.log(
        `Yes: ${voting.placarSim}, No: ${voting.placarNao}, Abstention: ${voting.placarAbstencao}`,
      );

      // Get individual votes
      const votesResponse = await this.camaraApi.getVotacaoVotos(votingId, {
        pagina: 1,
        itens: 100,
      });

      console.log(`\nIndividual votes:`);
      const votesByType = votesResponse.dados.reduce((acc, vote) => {
        if (!acc[vote.tipoVoto]) acc[vote.tipoVoto] = [];
        acc[vote.tipoVoto].push(vote.deputado_.nome);
        return acc;
      }, {} as Record<string, string[]>);

      Object.entries(votesByType).forEach(([voteType, deputies]) => {
        console.log(`${voteType}: ${deputies.length} deputies`);
      });

      return { voting, votes: votesResponse.dados };
    } catch (error) {
      console.error('Error fetching voting details:', error);
      throw error;
    }
  }
}
