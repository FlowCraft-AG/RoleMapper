import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RoleMapperModule } from '../role-mapper/role-mapper.module.js';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { ProcessesController } from './controller/processes.controller.js';
import { CamundaResolver } from './resolver/camunda.resolver.js';
import { ProcessesResolver } from './resolver/processes.resolver.js';
import { CamundaReadService } from './service/camunda.service.js';
import { ZeebeService } from './service/zeebe.service.js';

@Module({
    imports: [KeycloakModule, RoleMapperModule, HttpModule],
    controllers: [ProcessesController],
    providers: [ProcessesResolver, ZeebeService, CamundaReadService, CamundaResolver],
    exports: [ZeebeService, CamundaReadService],
})
export class ZeebeModule {}
