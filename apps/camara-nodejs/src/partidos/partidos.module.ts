import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PartidosController } from './controllers/partidos.controller';
import { PartidosService } from './services/partidos.service';
import { PartidosRepository } from './repository/partidos.repository';
import { PartidoModel } from './models/partido.model';
import { ClientModule } from '@client/client.module';

@Module({
  imports: [ClientModule, SequelizeModule.forFeature([PartidoModel])],
  controllers: [PartidosController],
  providers: [PartidosService, PartidosRepository],
  exports: [PartidosService, PartidosRepository],
})
export class PartidosModule {}
