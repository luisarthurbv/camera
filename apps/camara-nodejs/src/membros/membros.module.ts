import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MembrosController } from './controllers/membros.controller';
import { MembrosService } from './services/membros.service';
import { MembrosRepository } from './repository/membros.repository';
import { MembroModel } from './models/membro.model';

@Module({
  imports: [SequelizeModule.forFeature([MembroModel])],
  controllers: [MembrosController],
  providers: [MembrosService, MembrosRepository],
  exports: [MembrosService, MembrosRepository],
})
export class MembrosModule {}
