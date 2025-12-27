import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CamaraApiService } from './api-client.service';
import { CamaraApiController } from './camara-api.controller';

@Module({
  imports: [ConfigModule],
  controllers: [CamaraApiController],
  providers: [
    {
      provide: CamaraApiService,
      useFactory: (configService: ConfigService) => {
        return new CamaraApiService({
          baseURL: configService.get<string>(
            'CAMARA_API_BASE_URL',
            'https://dadosabertos.camara.leg.br/api/v2',
          ),
          timeout: configService.get<number>('CAMARA_API_TIMEOUT', 30000),
          defaultFormat: 'json',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [CamaraApiService],
})
export class ClientModule {}
