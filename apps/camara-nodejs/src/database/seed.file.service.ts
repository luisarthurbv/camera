import { Injectable } from '@nestjs/common';
import { DeputadosService } from '@deputados/services/deputados.service';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { Sexo } from '@commons/enums/sexo';

@Injectable()
export class SeedFileService {
  constructor(private readonly deputadosService: DeputadosService) {}

  async seed(): Promise<void> {
    await this.seedDeputadosFromCSV();
  }

  async seedDeputadosFromCSV(): Promise<void> {
    console.log('🌱 Starting deputados seeding from CSV...');

    // Download this file here https://dadosabertos.camara.leg.br/arquivos/deputados/csv/deputados.csv
    // and place it on the proper location.
    const csvPath = path.join(process.cwd(), 'resources/deputados.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found:', csvPath);
      return;
    }

    const parser = fs.createReadStream(csvPath).pipe(
      parse({
        delimiter: ';',
        columns: true, // Treat the first row as headers
        skip_empty_lines: true,
        trim: true,
      }),
    );

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for await (const record of parser) {
      try {
        const uriParts = record.apiUri.split('/');
        const deputadoId = parseInt(uriParts[uriParts.length - 1], 10);

        // The CSV has an empty header line at the end for some reason
        if (isNaN(deputadoId)) continue;

        const existing = await this.deputadosService.findById(deputadoId);
        if (existing) {
          skippedCount++;
          continue;
        }

        await this.deputadosService.create({
          id: deputadoId,
          cpf: record.cpf || null,
          nomeCivil: record.nomeCivil,
          nome: record.nome,
          sexo: record.siglaSexo as Sexo,
          dataNascimento: record.dataNascimento
            ? new Date(record.dataNascimento)
            : null,
          dataFalecimento: record.dataFalecimento
            ? new Date(record.dataFalecimento)
            : null,
          ufNascimento: record.ufNascimento || null,
          municipioNascimento: record.municipioNascimento || null,
          website: record.urlWebsite || null,
          redesSociais: record.urlRedeSocial
            ? record.urlRedeSocial.split(',')
            : null,
        });
        processedCount++;
      } catch (error) {
        console.error(
          `❌ Error processing record for deputado: ${record.nomeCivil}:`,
          error.message,
        );
        errorCount++;
      }
    }

    console.log('✅ Deputados CSV seeding complete!');
    console.log(
      `   - Created: ${processedCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`,
    );
  }
}
