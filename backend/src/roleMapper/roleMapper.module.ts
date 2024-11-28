import { Module } from '@nestjs/common';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from './model/entity/entities.entity.js';
import { ReadController } from './controller/read.controller.js';
import { ReadService } from './service/read.service.js';
import { QueryResolver } from './resolver/query.resolver.js';
import { writeController } from './controller/write.controller.js';
import { MutationResolver } from './resolver/mutation.resolver.js';
import { WriteService } from './service/write.service.js';

@Module({
  imports: [
    KeycloakModule,
    MongooseModule.forFeature(entities)
  ],
  controllers: [ReadController, writeController],
  providers: [ReadService, WriteService, QueryResolver, MutationResolver],
  exports: [ReadService, WriteService],
})
export class RoleMapperModule { }
