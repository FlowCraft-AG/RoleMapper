import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { ZeebeService } from '../service/zebee.service.js';

@Resolver()
export class ProcessesResolver {
    constructor(private readonly zeebeService: ZeebeService) {}

    @Public()
    @Mutation(() => String) // Gibt einen String (z. B. Prozessinstanz-ID) zurück
    async startProcess(
        @Args('processKey') processKey: string,
        @Args('variables') variables: string,
    ): Promise<string> {
        const kp = { eingabe: 'gyca1011', userId: variables, procesId: 'DA0001' };
        const result = await this.zeebeService.startProcess(processKey, kp);
        console.log('Process started:', result);
        return `Process started with key: ${result.processInstanceKey}`;
    }
}
