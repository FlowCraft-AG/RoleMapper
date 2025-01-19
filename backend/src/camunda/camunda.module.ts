import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RoleMapperModule } from '../role-mapper/role-mapper.module.js';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { ProcessesController } from './controller/processes.controller.js';
import { CamundaMutationResolver } from './resolver/camunda-mutation.resolver.js';
import { CamundaQueryResolver } from './resolver/camunda-query.resolver.js';
import { ProcessesResolver } from './resolver/processes.resolver.js';
import { CamundaReadService } from './service/camunda-read.service.js';
import { CamundaWriteService } from './service/camunda-write.service.js';
import { ZeebeService } from './service/zeebe.service.js';

@Module({
    imports: [KeycloakModule, RoleMapperModule, HttpModule],
    controllers: [ProcessesController],
    providers: [
        ProcessesResolver,
        ZeebeService,
        CamundaReadService,
        CamundaWriteService,
        CamundaQueryResolver,
        CamundaMutationResolver,
    ],
    exports: [ZeebeService, CamundaReadService, CamundaWriteService],
})
export class CamundaModule {}
