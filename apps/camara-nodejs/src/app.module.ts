import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { PartidosModule } from './partidos/partidos.module';
import { PartidoModel } from './partidos/models/partido.model';
import { DeputadosModule } from './deputados/deputados.module';
import { DeputadoModel } from './deputados/models/deputado.model';
import { ProfissaoModel } from './deputados/models/profissao.model';
import { OcupacaoModel } from './deputados/models/ocupacao.model';
import { SeedAPIService } from './database/seed.api.service';
import { SeedFileService } from './database/seed.file.service';
import { LegislaturaModel } from './legislaturas/models/legislatura.model';
import { LegislaturasModule } from './legislaturas/legislaturas.module';
import { MembrosModule } from './membros/membros.module';
import { MembroModel } from './membros/models/membro.model';
import { ScraperModule } from './scraper/scraper.module';
import { DeputadoLegislaturaModel } from './deputados/models/deputado-legislatura.model';
import { OrgaosModule } from './orgaos/orgaos.module';
import { OrgaoModel } from './orgaos/models/orgao.model';
import { VotacoesModule } from '@votacoes/votacoes.module';
import { VotacaoModel } from '@votacoes/models/votacao.model';
import { VotacaoDeputadoModel } from '@votacoes/models/votacao-deputado.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')) || 5432,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        models: [
          PartidoModel,
          DeputadoModel,
          ProfissaoModel,
          OcupacaoModel,
          LegislaturaModel,
          MembroModel,
          DeputadoLegislaturaModel,
          OrgaoModel,
          VotacaoModel,
          VotacaoDeputadoModel,
        ],
        autoLoadModels: true,
        synchronize: false, // Disabled since we're using migrations
      }),
      inject: [ConfigService],
    }),
    ClientModule,
    PartidosModule,
    DeputadosModule,
    LegislaturasModule,
    MembrosModule,
    ScraperModule,
    OrgaosModule,
    VotacoesModule,
  ],
  providers: [AppService, SeedAPIService, SeedFileService],
})
export class AppModule {}
