import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { ZeebeService } from '../service/zebee.service.js';

@Controller('processes')
export class ProcessesController {
    constructor(private readonly zeebeService: ZeebeService) {}

    @Post('start')
    @Public()
    async startProcess(@Body() body: { processKey: string; variables: Record<string, any> }) {
        const { processKey, variables } = body;
        const result = this.zeebeService.startProcess(processKey, variables);
        console.log('Process started:', result);
        return result;
    }
}
