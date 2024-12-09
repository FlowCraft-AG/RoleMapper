import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { ReadController } from './controller/read.controller.js';
import { WriteController } from './controller/write.controller.js';
import { entities } from './model/entity/entities.entity.js';
import { EntityResultResolver } from './resolver/entity-result.resolver.js';
import { MutationResolver } from './resolver/mutation.resolver.js';
import { QueryResolver } from './resolver/query.resolver.js';
import { ReadService } from './service/read.service.js';
import { WriteService } from './service/write.service.js';

@Module({
    imports: [KeycloakModule, MongooseModule.forFeature(entities)],
    controllers: [ReadController, WriteController],
    providers: [ReadService, WriteService, QueryResolver, MutationResolver, EntityResultResolver],
    exports: [ReadService, WriteService],
})
export class RoleMapperModule {}
