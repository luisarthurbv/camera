import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { DeputadosRepository } from '@deputados/repository/deputados.repository';

// Helper to pause between requests
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get random delay between 0 and 5 seconds
const randomDelay = () => Math.random() * 5000;

@Injectable()
export class ScraperService {
  private readonly downloadsDir: string;
  private readonly baseUrl = 'https://www.camara.leg.br/deputados';

  constructor(private readonly deputadosRepository: DeputadosRepository) {
    // Set downloads directory at project root
    this.downloadsDir = path.join(process.cwd(), 'downloads', 'deputados');
    this.ensureDownloadsDirectory();
  }

  private ensureDownloadsDirectory(): void {
    if (!fs.existsSync(this.downloadsDir)) {
      fs.mkdirSync(this.downloadsDir, { recursive: true });
      console.log(`📁 Created downloads directory: ${this.downloadsDir}`);
    }
  }

  private getFilePath(deputadoId: number): string {
    return path.join(this.downloadsDir, `${deputadoId}.html`);
  }

  private fileExists(deputadoId: number): boolean {
    return fs.existsSync(this.getFilePath(deputadoId));
  }

  private async downloadPage(deputadoId: number): Promise<void> {
    const url = `${this.baseUrl}/${deputadoId}/biografia`;
    const filePath = this.getFilePath(deputadoId);

    try {
      console.log(`📥 Downloading: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 30000, // 30 second timeout
      });

      fs.writeFileSync(filePath, response.data, 'utf-8');
      console.log(`✅ Saved: ${deputadoId}.html`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ Failed to download ${deputadoId}: ${error.message}`);
        if (error.response) {
          console.error(`   Status: ${error.response.status}`);
        }
      } else {
        console.error(`❌ Failed to download ${deputadoId}:`, error);
      }
      throw error;
    }
  }

  async scrapeAll(): Promise<void> {
    console.log('🕷️  Starting deputado biography scraper...');
    console.log(`📁 Downloads directory: ${this.downloadsDir}`);

    // Get all deputado IDs from database
    const deputados = await this.deputadosRepository.findAll();
    console.log(`📊 Found ${deputados.length} deputados in database`);

    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const deputado of deputados) {
      // Check if file already exists
      if (this.fileExists(deputado.id)) {
        console.log(
          `⏭️  Skipping ${deputado.id} (${
            deputado.nome || deputado.nomeCivil
          }): file already exists`,
        );
        skipped++;
        continue;
      }

      try {
        // Download the page
        await this.downloadPage(deputado.id);
        downloaded++;

        // Rate limiting: wait 10 seconds + random 0-5 seconds
        const baseDelay = 10000;
        const totalDelay = baseDelay + randomDelay();
        console.log(
          `⏳ Waiting ${(totalDelay / 1000).toFixed(
            2,
          )}s before next request...`,
        );
        await sleep(totalDelay);
      } catch (error) {
        failed++;
        // Continue with next deputado even if one fails
        console.log(`⚠️  Continuing with next deputado...`);

        // Still wait before next request to be respectful
        const totalDelay = 5000 + randomDelay();
        await sleep(totalDelay);
      }
    }

    console.log('\n📊 Scraping Summary:');
    console.log(`   ✅ Downloaded: ${downloaded}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📁 Total files: ${downloaded + skipped}`);
    console.log('✨ Scraping completed!');
  }

  async scrapeOne(deputadoId: number): Promise<void> {
    console.log(`🕷️  Scraping biography for deputado ${deputadoId}...`);

    if (this.fileExists(deputadoId)) {
      console.log(`⏭️  File already exists: ${deputadoId}.html`);
      return;
    }

    await this.downloadPage(deputadoId);
    console.log('✅ Scraping completed!');
  }

  getStats(): { total: number; downloaded: number; missing: number } {
    const files = fs.readdirSync(this.downloadsDir);
    const htmlFiles = files.filter((f) => f.endsWith('.html'));

    return {
      total: htmlFiles.length,
      downloaded: htmlFiles.length,
      missing: 0, // Would need to compare with DB to get accurate count
    };
  }
}
