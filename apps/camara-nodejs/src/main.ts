import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runSeeding } from './database/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');

  // Run seeding after bootstrap
  await runSeeding();
}
bootstrap();
