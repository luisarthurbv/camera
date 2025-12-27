import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrgaosService } from './services/orgaos.service';
import { OrgaosRepository } from './repository/orgaos.repository';
import { OrgaoModel } from './models/orgao.model';

@Module({
  imports: [SequelizeModule.forFeature([OrgaoModel])],
  providers: [OrgaosService, OrgaosRepository],
  exports: [OrgaosService, OrgaosRepository],
})
export class OrgaosModule {}
