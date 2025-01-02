import { Module } from '@nestjs/common';
import { RoleMapperModule } from '../role-mapper/role-mapper.module.js';
import { ProcessesController } from './controller/processes.controller.js';
import { ProcessesResolver } from './resolver/processes.resolver.js';
import { ZeebeService } from './service/zebee.service.js';

@Module({
    imports: [RoleMapperModule],
    controllers: [ProcessesController],
    providers: [ProcessesResolver, ZeebeService],
    exports: [ZeebeService],
})
export class ZeebeModule {}
