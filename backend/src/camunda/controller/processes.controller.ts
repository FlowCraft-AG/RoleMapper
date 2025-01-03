import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ZeebeService } from '../service/zeebe.service.js';

@Controller('processes')
export class ProcessesController {
    readonly #logger = getLogger(ProcessesController.name);
    constructor(private readonly zeebeService: ZeebeService) {}

    @Post('start')
    @Public()
    async startProcess(@Body() body: { processKey: string; variables: Record<string, any> }) {
        const { processKey, variables } = body;
        const result = this.zeebeService.startProcess(processKey, variables);
        this.#logger.debug('Process started:', result);
        return result;
    }
}
