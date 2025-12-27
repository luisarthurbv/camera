import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ScraperService } from './scraper.service';

async function runScraper() {
  console.log('🚀 Initializing scraper application...\n');

  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'], // Reduce NestJS startup logs
  });

  try {
    // Get the scraper service
    const scraperService = app.get(ScraperService);

    // Check if a specific deputado ID was provided
    const deputadoId = process.argv[2];

    if (deputadoId) {
      // Scrape single deputado
      const id = parseInt(deputadoId, 10);
      if (isNaN(id)) {
        console.error('❌ Invalid deputado ID. Please provide a valid number.');
        process.exit(1);
      }
      await scraperService.scrapeOne(id);
    } else {
      // Scrape all deputados
      await scraperService.scrapeAll();
    }

    console.log('\n✨ Done!');
  } catch (error) {
    console.error('\n❌ Scraper failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runScraper();
