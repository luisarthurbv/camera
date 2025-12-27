import { Injectable } from '@nestjs/common';
import { CamaraApiService } from '@client/api-client.service';
import { PartidosRepository } from '@partidos/repository/partidos.repository';
import { DeputadosService } from '@deputados/services/deputados.service';
import {
  ApiResponse,
  Deputado,
  DeputadoDetalhado,
  Legislatura,
} from '@client/index';
import { LegislaturasService } from '@legislaturas/services/legislaturas.service';
import { MembrosRepository } from '@membros/repository/membros.repository';
import { DeputadoLegislaturasRepository } from '@deputados/repository/deputado-legislaturas.repository';
import { LegislaturasRepository } from '@legislaturas/repository/legislaturas.repository';
import { Partido } from '@partidos/domain/partido';
import { OrgaosRepository } from '@orgaos/repository/orgaos.repository';
import { Casa } from '@orgaos/domain/orgao';
import { VotacoesRepository } from '@votacoes/repository/votacoes.repository';
import { VotacoesDeputadosRepository } from '@votacoes/repository/votacoes-deputados.repository';
import { Voto } from '@commons/enums/voto';
import * as fs from 'fs';
import * as path from 'path';
// Small helper to pause between API calls
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class SeedAPIService {
  constructor(
    private readonly camaraApiService: CamaraApiService,
    private readonly partidosRepository: PartidosRepository,
    private readonly deputadosService: DeputadosService,
    private readonly legislaturasService: LegislaturasService,
    private readonly legislaturasRepository: LegislaturasRepository,
    private readonly membrosRepository: MembrosRepository,
    private readonly deputadoLegislaturasRepository: DeputadoLegislaturasRepository,
    private readonly orgaosRepository: OrgaosRepository,
    private readonly votacoesRepository: VotacoesRepository,
    private readonly votacoesDeputadosRepository: VotacoesDeputadosRepository,
  ) {}

  async seed(): Promise<void> {
    // await this.seedLegislaturas();
    // for (let i = 41; i <= 57; i++) {
    //   await this.seedPartidos(i);
    //   sleep(3000);
    // }
    await this.seedDeputados();
    // await this.seedPartidosMembros();
    // await this.seedDeputadoLegislaturas();
    // await this.seedOrgaos();
    // await this.seedVotacoes();
  }

  async seedPartidos(idLegislatura?: number): Promise<void> {
    try {
      console.log('🌱 Starting partido seeding...');

      // Check if partidos already exist
      const existingPartidos = await this.partidosRepository.findAll();
      // if (existingPartidos.length > 0) {
      //   console.log(`✅ Partidos already seeded (${existingPartidos.length} found)`);
      //   return;
      // }

      // Fetch all partidos from the API
      const response = await this.camaraApiService.getPartidos({
        ordem: 'DESC',
        idLegislatura,
      });

      if (!response.dados || response.dados.length === 0) {
        console.log('⚠️ No partidos found in API response');
        return;
      }

      console.log(`📥 Fetched ${response.dados.length} partidos from API`);

      // Save each partido to the database
      let savedCount = 0;
      for (const partidoData of response.dados) {
        try {
          if (existingPartidos.map((p) => p.id).includes(partidoData.id)) {
            continue;
          }
          await this.partidosRepository.create({
            id: partidoData.id,
            nome: partidoData.nome,
            sigla: partidoData.sigla,
          });
          savedCount++;
        } catch (error) {
          console.error(
            `❌ Failed to save partido ${partidoData.sigla}:`,
            error.message,
          );
        }
      }

      console.log(`✅ Successfully seeded ${savedCount} partidos`);
    } catch (error) {
      console.error('❌ Failed to seed partidos:', error.message);
      throw error;
    }
  }

  async seedDeputados(): Promise<void> {
    const partidos = await this.partidosRepository.findAll();
    for (const partido of partidos) {
      await this.seedDeputadosByPartido(partido);
    }
  }

  async seedDeputadosByPartido(partido: Partido): Promise<void> {
    if ([36893].indexOf(partido.id) !== -1) {
      return;
    }
    let response = await this.camaraApiService.getPartidoMembros(partido.id);
    for (const deputado of response.dados) {
      await sleep(1000);
      await this.saveDeputado(deputado);
    }
    let page = 2;
    while (response.links.find((link) => link.rel === 'next')) {
      response = await this.camaraApiService.getPartidoMembros(partido.id, {
        pagina: page,
      });
      page++;
    }
  }

  async saveDeputado(deputadoData: Deputado) {
    if (await this.deputadosService.findById(deputadoData.id)) {
      return;
    }
    const apiResponse: ApiResponse<DeputadoDetalhado> =
      await this.camaraApiService.getDeputado(deputadoData.id);
    const deputadoResponse = apiResponse.dados as any as DeputadoDetalhado;
    await this.deputadosService.create({
      id: deputadoResponse.id,
      cpf: deputadoResponse.cpf,
      nomeCivil: deputadoResponse.nomeCivil,
      nome: deputadoResponse.nome,
      sexo: deputadoResponse.sexo as any,
      dataNascimento: deputadoResponse.dataNascimento
        ? new Date(deputadoResponse.dataNascimento)
        : null,
      dataFalecimento: deputadoResponse.dataFalecimento
        ? new Date(deputadoResponse.dataFalecimento)
        : null,
      ufNascimento: deputadoResponse.ufNascimento,
      municipioNascimento: deputadoResponse.municipioNascimento,
      redesSociais: deputadoResponse.redeSocial,
      website: '',
    });
  }

  async seedLegislaturas(): Promise<void> {
    let apiResponse = await this.camaraApiService.getLegislaturas();
    for (const legislatura of apiResponse.dados) {
      await this.saveLegislatura(legislatura);
    }
    let page = 2;
    while (apiResponse.links.find((link) => link.rel === 'next')) {
      apiResponse = await this.camaraApiService.getLegislaturas({
        pagina: page,
      });
      for (const legislatura of apiResponse.dados) {
        await this.saveLegislatura(legislatura);
      }
      page++;
    }
  }

  async saveLegislatura(legislaturaData: Legislatura) {
    if (await this.legislaturasService.findById(legislaturaData.id)) {
      return;
    }
    await this.legislaturasService.create({
      id: legislaturaData.id,
      dataInicio: new Date(legislaturaData.dataInicio),
      dataFim: new Date(legislaturaData.dataFim),
    });
  }

  async seedPartidosMembros(): Promise<void> {
    const partidos = await this.partidosRepository.findAll();
    for (const partido of partidos) {
      await this.seedPartidoMembros(partido);
    }
  }

  async seedPartidoMembros(partido: Partido): Promise<void> {
    let response = await this.camaraApiService.getPartidoMembros(partido.id);
    for (const deputado of response.dados) {
      await this.saveMembro(deputado, partido.id);
    }
    let page = 2;
    while (response.links.find((link) => link.rel === 'next')) {
      await sleep(1000);
      response = await this.camaraApiService.getPartidoMembros(partido.id, {
        pagina: page,
      });
      for (const deputado of response.dados) {
        await this.saveMembro(deputado, partido.id);
      }
      page++;
    }
  }

  async saveMembro(membroData: Deputado, partidoId: number) {
    await this.membrosRepository.create({
      deputadoId: membroData.id,
      partidoId: partidoId,
      legislaturaId: membroData.idLegislatura,
    });
  }

  async seedDeputadoLegislaturas(): Promise<void> {
    try {
      console.log('🌱 Starting deputado legislaturas seeding from CSV...');

      // Read CSV file
      const csvPath = path.join(process.cwd(), 'legislaturas.csv');
      if (!fs.existsSync(csvPath)) {
        console.error('❌ CSV file not found:', csvPath);
        return;
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n').filter((line) => line.trim());

      // Skip header
      const dataLines = lines.slice(1);

      // Fetch all partidos and legislaturas
      console.log('📥 Fetching partidos and legislaturas from database...');
      const partidos = await this.partidosRepository.findAll();
      const legislaturas = await this.legislaturasRepository.findAll();

      console.log(
        `✅ Found ${partidos.length} partidos and ${legislaturas.length} legislaturas`,
      );

      // Create maps for quick lookup
      const partidosBySigla = new Map(partidos.map((p) => [p.sigla, p]));

      // Map historical/alternative partido names
      const partidoSiglaMapping: Record<string, string> = {
        PATRIOTA: 'PATRI', // PATRIOTA was renamed to PATRI
        SD: 'SOLIDARIEDADE', // SD is the abbreviation
        PCB: 'PCB*', // Keep as is, might need manual addition
      };

      let processedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;
      const missingPartidos = new Set<string>();
      const noMatchLegislaturas: Array<{ deputadoId: number; range: string }> =
        [];

      for (const line of dataLines) {
        try {
          const [
            deputadoIdStr,
            legislaturaStartStr,
            legislaturaEndStr,
            state,
            partidoSigla,
          ] = line.split(',').map((s) => s.trim());

          const deputadoId = parseInt(deputadoIdStr);
          const legislaturaStart = parseInt(legislaturaStartStr);
          const legislaturaEnd = parseInt(legislaturaEndStr);

          // Skip if not a 4-year legislatura
          if (legislaturaEnd - legislaturaStart !== 4) {
            skippedCount++;
            continue;
          }

          // Find partido by sigla (with mapping for historical names)
          const mappedSigla = partidoSiglaMapping[partidoSigla] || partidoSigla;
          const partido = partidosBySigla.get(mappedSigla);
          if (!partido) {
            missingPartidos.add(partidoSigla);
            errorCount++;
            continue;
          }

          // Create date range for the CSV row
          const rowStartDate = new Date(`${legislaturaStart}-02-01T00:00:00`);
          const rowEndDate = new Date(`${legislaturaEnd}-01-31T23:59:59`);

          // Find legislatura with most overlap
          let bestLegislatura = null;
          let maxOverlap = 0;

          for (const legislatura of legislaturas) {
            const legStart = new Date(legislatura.dataInicio);
            const legEnd = new Date(legislatura.dataFim);

            // Calculate overlap
            const overlapStart = new Date(
              Math.max(rowStartDate.getTime(), legStart.getTime()),
            );
            const overlapEnd = new Date(
              Math.min(rowEndDate.getTime(), legEnd.getTime()),
            );

            if (overlapStart <= overlapEnd) {
              const overlapDays =
                (overlapEnd.getTime() - overlapStart.getTime()) /
                (1000 * 60 * 60 * 24);
              if (overlapDays > maxOverlap) {
                maxOverlap = overlapDays;
                bestLegislatura = legislatura;
              }
            }
          }

          if (!bestLegislatura) {
            noMatchLegislaturas.push({
              deputadoId,
              range: `${legislaturaStart}-${legislaturaEnd}`,
            });
            errorCount++;
            continue;
          }

          // Check if record already exists
          const existing = await this.deputadoLegislaturasRepository.findOne(
            deputadoId,
            bestLegislatura.id,
            partido.id,
          );

          if (existing) {
            skippedCount++;
            continue;
          }

          // Create the record
          await this.deputadoLegislaturasRepository.create(
            deputadoId,
            bestLegislatura.id,
            partido.id,
            rowStartDate,
            rowEndDate,
            state,
          );

          processedCount++;
        } catch (error) {
          console.error(`❌ Error processing line: ${line}`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ Seeding complete!`);
      console.log(`   - Processed: ${processedCount}`);
      console.log(`   - Skipped: ${skippedCount}`);
      console.log(`   - Errors: ${errorCount}`);

      if (missingPartidos.size > 0) {
        console.log(`\n⚠️ Missing Partidos (${missingPartidos.size}):`);
        console.log(`   ${Array.from(missingPartidos).join(', ')}`);
      }

      if (noMatchLegislaturas.length > 0) {
        console.log(
          `\n⚠️ No matching legislatura found (${noMatchLegislaturas.length}):`,
        );
        noMatchLegislaturas.slice(0, 10).forEach((item) => {
          console.log(`   - Deputado ${item.deputadoId}: ${item.range}`);
        });
        if (noMatchLegislaturas.length > 10) {
          console.log(`   ... and ${noMatchLegislaturas.length - 10} more`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to seed deputado legislaturas:', error.message);
      throw error;
    }
  }

  async seedOrgaos(): Promise<void> {
    try {
      console.log('🌱 Starting orgaos seeding from CSV...');

      // Read CSV file
      const csvPath = path.join(process.cwd(), 'downloads/orgaos.csv');
      if (!fs.existsSync(csvPath)) {
        console.error('❌ CSV file not found:', csvPath);
        return;
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n').filter((line) => line.trim());

      // Skip header
      const dataLines = lines.slice(1);

      let processedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      for (const line of dataLines) {
        try {
          // Parse CSV line (semicolon-separated, quoted values)
          const columns = line
            .split(';')
            .map((col) => col.replace(/^"(.*)"$/, '$1').trim());

          if (columns.length < 16) {
            console.warn(
              `⚠️ Skipping malformed line: ${line.substring(0, 100)}...`,
            );
            skippedCount++;
            continue;
          }

          const [
            idStr,
            sigla,
            apelido,
            nome,
            nomePublicacao,
            codTipoOrgao,
            tipoOrgao,
            dataInicio,
            dataInstalacao,
            dataFim,
            dataFimOriginal,
            codSituacao,
            descricaoSituacao,
            casa,
            sala,
            urlWebsite,
          ] = columns;

          // Parse ID
          const id = parseInt(idStr);
          if (isNaN(id)) {
            console.warn(`⚠️ Invalid ID: ${idStr}`);
            skippedCount++;
            continue;
          }

          // Check if orgao already exists
          const existingOrgao = await this.orgaosRepository.findById(id);
          if (existingOrgao) {
            skippedCount++;
            continue;
          }

          // Map casa to enum
          let casaEnum: Casa;
          if (casa === 'Câmara dos Deputados') {
            casaEnum = Casa.CAMARA_DOS_DEPUTADOS;
          } else if (casa === 'Congresso Nacional') {
            casaEnum = Casa.CONGRESSO_NACIONAL;
          } else {
            console.warn(`⚠️ Unknown casa value: ${casa} for orgao ${id}`);
            skippedCount++;
            continue;
          }

          // Create orgao
          await this.orgaosRepository.create({
            id,
            sigla,
            apelido,
            tipo: tipoOrgao,
            nome,
            casa: casaEnum,
          });

          processedCount++;
        } catch (error) {
          console.error(
            `❌ Error processing line: ${line.substring(0, 100)}...`,
            error.message,
          );
          errorCount++;
        }
      }

      console.log(`✅ Seeding complete!`);
      console.log(`   - Processed: ${processedCount}`);
      console.log(`   - Skipped (already exist): ${skippedCount}`);
      console.log(`   - Errors: ${errorCount}`);
    } catch (error) {
      console.error('❌ Failed to seed orgaos:', error.message);
      throw error;
    }
  }

  async seedVotacoes(): Promise<void> {
    try {
      console.log('🌱 Starting votacoes seeding from CSV...');

      // Read CSV file
      const csvPath = path.join(process.cwd(), 'downloads/votacoes-votos.csv');
      if (!fs.existsSync(csvPath)) {
        console.error('❌ CSV file not found:', csvPath);
        return;
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n').filter((line) => line.trim());

      // Skip header
      const dataLines = lines.slice(1);

      let processedVotacoes = 0;
      let processedVotosDeputados = 0;
      let skippedCount = 0;
      let errorCount = 0;
      const votacoesSet = new Set<string>();

      console.log(`📥 Processing ${dataLines.length} vote records...`);

      for (const line of dataLines) {
        try {
          // Parse CSV line (comma-separated)
          const columns = line.split(';').map((col) => col.trim());

          if (columns.length < 12) {
            console.warn(
              `⚠️ Skipping malformed line: ${line.substring(0, 100)}...`,
            );
            skippedCount++;
            continue;
          }

          const [
            idVotacao,
            uriVotacao,
            dataHoraVoto,
            voto,
            deputadoIdStr,
            deputadoUri,
            deputadoNome,
            deputadoSiglaPartido,
            deputadoUriPartido,
            deputadoSiglaUf,
            deputadoIdLegislaturaStr,
            deputadoUrlFoto,
          ] = columns;

          // Parse deputado ID
          const deputadoId = parseInt(deputadoIdStr);
          if (isNaN(deputadoId)) {
            console.warn(`⚠️ Invalid deputado ID: ${deputadoIdStr}`);
            skippedCount++;
            continue;
          }

          // Map Portuguese vote values to enum
          const votoMapping: Record<string, string> = {
            Abstenção: 'ABSTENCAO',
            'Artigo 17': 'ARTIGO_17',
            Não: 'NAO',
            Obstrução: 'OBSTRUCAO',
            Sim: 'SIM',
          };

          const votoEnum = votoMapping[voto];
          if (!votoEnum) {
            console.warn(
              `⚠️ Invalid voto value: ${voto} for votacao ${idVotacao}`,
            );
            skippedCount++;
            continue;
          }

          // Parse date
          const votoMoment = new Date(dataHoraVoto);
          if (isNaN(votoMoment.getTime())) {
            console.warn(`⚠️ Invalid date: ${dataHoraVoto}`);
            skippedCount++;
            continue;
          }

          // Create votacao if not already created
          if (!votacoesSet.has(idVotacao)) {
            const existingVotacao = await this.votacoesRepository.findById(
              idVotacao,
            );
            if (!existingVotacao) {
              await this.votacoesRepository.create({ id: idVotacao });
              processedVotacoes++;
            }
            votacoesSet.add(idVotacao);
          }

          // Check if voto deputado already exists
          const existingVoto = await this.votacoesDeputadosRepository.findById(
            idVotacao,
            deputadoId,
          );
          if (existingVoto) {
            skippedCount++;
            continue;
          }

          // Create votacao deputado
          await this.votacoesDeputadosRepository.create({
            idVotacao,
            deputadoId,
            voto: votoEnum as Voto,
            votoMoment,
          });

          processedVotosDeputados++;
        } catch (error) {
          console.error(
            `❌ Error processing line: ${line.substring(0, 100)}...`,
            error.message,
          );
          errorCount++;
        }
      }

      console.log(`✅ Seeding complete!`);
      console.log(`   - Votacoes created: ${processedVotacoes}`);
      console.log(`   - Votos deputados created: ${processedVotosDeputados}`);
      console.log(`   - Skipped (already exist): ${skippedCount}`);
      console.log(`   - Errors: ${errorCount}`);
    } catch (error) {
      console.error('❌ Failed to seed votacoes:', error.message);
      throw error;
    }
  }
}
