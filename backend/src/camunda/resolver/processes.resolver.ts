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
    @Mutation() // Gibt einen String (z. B. Prozessinstanz-ID) zurück
    async startProcess(
        @Args('processKey') processKey: string,
        @Args('userId') userId: string,
    ): Promise<string> {
        const variables = { userId };
        this.#logger.debug('Starting process: processKey=%s, userId=%o', processKey, variables);
        const result = await this.#zeebeService.startProcess(processKey, variables);
        this.#logger.debug('Process started:', result);
        return `Process started with key: ${result.processInstanceKey}`;
    }

    // @Public()
    // @Mutation() // Gibt einen String (z. B. Prozessinstanz-ID) zurück
    // async startProcessWithVariables(
    //     @Args('processKey') processKey: string,
    //     @Args('variables') variables: Record<string, unknown>,
    // ): Promise<string> {
    //     this.#logger.debug('Starting process: processKey=%s, variables=%o', processKey, variables);
    //     const result = await this.#zeebeService.startProcess(processKey, variables);
    //     this.#logger.debug('Process started:', result);
    //     return `Process started with key: ${result.processInstanceKey}`;
    // }

    @Public()
    @Mutation() // Gibt einen String (z. B. Prozessinstanz-ID) zurück
    async cancelProcessInstance(
        @Args('processInstanceKey') processInstanceKey: string,
    ): Promise<string> {
        this.#logger.debug('cancelProcessInstance: processInstanceKey=%s', processInstanceKey);
        await this.#zeebeService.cancelProcessInstance(processInstanceKey);
        return `Process instance cancelled: ${processInstanceKey}`;
    }
}
