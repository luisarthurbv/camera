#!/usr/bin/env ts-node
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedAPIService } from './seed.api.service';
import { SeedFileService } from './seed.file.service';

export async function runSeeding() {
  console.log('🌱 Starting data seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const apiSeedService = app.get(SeedAPIService);
  const fileSeedService = app.get(SeedFileService);

  try {
    // await apiSeedService.seed();
    await fileSeedService.seed();
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  runSeeding();
}
