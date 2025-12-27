import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LegislaturasController } from './controllers/legislaturas.controller';
import { LegislaturasService } from './services/legislaturas.service';
import { LegislaturasRepository } from './repository/legislaturas.repository';
import { LegislaturaModel } from './models/legislatura.model';

@Module({
  imports: [SequelizeModule.forFeature([LegislaturaModel])],
  controllers: [LegislaturasController],
  providers: [LegislaturasService, LegislaturasRepository],
  exports: [LegislaturasService, LegislaturasRepository],
})
export class LegislaturasModule {}
