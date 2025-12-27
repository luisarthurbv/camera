import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { DeputadosModule } from '@deputados/deputados.module';

@Module({
  imports: [DeputadosModule],
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
