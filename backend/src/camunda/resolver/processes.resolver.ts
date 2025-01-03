import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ZeebeService } from '../service/zeebe.service.js';

@Resolver()
export class ProcessesResolver {
    readonly #logger = getLogger(ProcessesResolver.name);
    readonly #zeebeService: ZeebeService;

    constructor(zeebeService: ZeebeService) {
        this.#zeebeService = zeebeService;
    }

    @Public()
    @Mutation(() => String) // Gibt einen String (z. B. Prozessinstanz-ID) zurück
    async startProcess(
        @Args('processKey') processKey: string,
        @Args('variables') variables: string,
    ): Promise<string> {
        const kp = { eingabe: 'gyca1011', userId: variables, procesId: 'DA0001' };
        const result = await this.#zeebeService.startProcess(processKey, kp);
        this.#logger.debug('Process started:', result);
        return `Process started with key: ${result.processInstanceKey}`;
    }
}
