/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @stylistic/operator-linebreak */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { CamundaReadService } from '../service/camunda.service.js';
import { ProcessFilterInput, VariableFilterInput } from '../types/input/process-filter.Input.js';
import { ProcessInstance, ProcessVariable, Task } from '../types/process.type.js';
@Resolver()
export class CamundaResolver {
    readonly #logger = getLogger(CamundaResolver.name);
    readonly #camundaService: CamundaReadService;

    constructor(camundaService: CamundaReadService) {
        this.#camundaService = camundaService;
    }

    @Query('getTasksByUserId')
    @Public()
    async getTasksByUserId(@Args('userId') userId: string, @Context() context: any) {
        const token = this.#extractToken(context);
        this.#logger.debug('Get tasks by userId: userId=%s', userId);
        const userTaskList: Task[] = await this.#camundaService.findTasksByUserId(userId, token);
        this.#logger.debug('Get tasks by userId: userTasksList=%s', userTaskList);
        return userTaskList;
    }

    @Query('getProcessesByKey')
    @Public()
    async getProcessInstancesByProcessInstanceKey(
        @Args('processInstancenKey') key: string,
        @Context() context: any,
    ): Promise<ProcessInstance> {
        const token = this.#extractToken(context);
        this.#logger.debug('getProcessInstancesByProcessInstanceKey: processInstanceKey=%s', key);
        const instanzen: ProcessInstance = await this.#camundaService.findProcessInstance(
            key,
            token,
        );
        this.#logger.debug(
            'getProcessInstancesByProcessInstanceKey: ProcessInstance=%o',
            instanzen,
        );
        return instanzen;
    }

    @Query('getProcessesByUserId')
    @Public()
    async getProcessInstancesByUserId(
        @Args('userId') userId: string,
        @Context() context: any,
    ): Promise<ProcessInstance[]> {
        const token = this.#extractToken(context);
        this.#logger.debug('getProcessInstancesByUserId: userId=%s', userId);
        const userTaskList: Task[] = await this.#camundaService.findTasksByUserId(userId, token);
        this.#logger.debug('getProcessInstancesByUserId: userTaskList=%o', userTaskList);
        const processInstanceKeyList: string[] = userTaskList.map(
            (task) => task.processInstanceKey,
        );
        this.#logger.debug(
            'getProcessInstancesByUserId: prozessInstanzenKeys=%o',
            processInstanceKeyList,
        );
        const processInstanceList: ProcessInstance[] = [];
        for (const key of processInstanceKeyList) {
            const instanz: ProcessInstance = await this.#camundaService.findProcessInstance(
                key,
                token,
            );
            processInstanceList.push(instanz);
        }
        this.#logger.debug('getProcessInstancesByUserId: ProcessInstances=%o', processInstanceList);
        return processInstanceList;
    }

    @Query('getCamundaProcesses')
    @Public()
    async getProzessListe(@Args('filter') filter: ProcessFilterInput, @Context() context: any) {
        const token = this.#extractToken(context);
        this.#logger.debug('getProzessListe: filter=%o', filter);
        const instanzen: ProcessInstance[] = await this.#camundaService.findProzessListe(
            filter,
            token,
        );
        this.#logger.debug('getProzessListe: Instanzen=%o', instanzen);
        return instanzen;
    }

    @Query('getTasks')
    @Public()
    async getTasks(@Args('filter') filter: ProcessFilterInput, @Context() context: any) {
        const token = this.#extractToken(context);
        this.#logger.debug('getTasks: filter=%o', filter);
        const instanzen: Task[] = await this.#camundaService.findTaskListe(filter, token);
        this.#logger.debug('getTasks: Instanzen=%o', instanzen);
        return instanzen;
    }

    @Public()
    @Query('searchTaskVariables')
    async searchTaskVariables(
        @Args('filter') filter: VariableFilterInput,
        @Context() context: any,
    ): Promise<ProcessVariable[]> {
        const token = this.#extractToken(context);
        this.#logger.debug('searchTaskVariables: Filter: %o', filter);
        const variables: ProcessVariable[] = await this.#camundaService.searchTaskVariables(
            filter,
            token,
        );
        this.#logger.debug('searchTaskVariables: Variablen: %o', variables);
        return variables;
    }

    @Public()
    @Query('getProcessDefinitionXmlByKey')
    async getProcessDefinitionXmlByKey(
        @Args('processDefinitionKey') key: string,
        @Context() context: any,
    ): Promise<string> {
        const token = this.#extractToken(context);
        this.#logger.debug('getProcessDefinitionXmlByKey: processDefinitionKey=%s', key);
        const xml = await this.#camundaService.getProcessDefinitionXmlByKey(key, token);
        this.#logger.debug('getProcessDefinitionXmlByKey: xml=%s', xml);
        return xml;
    }

    #extractToken(context: any): string {
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;

        if (
            authorizationHeader === undefined ||
            authorizationHeader.startsWith('Bearer ') === undefined
        ) {
            this.#logger.error('Authorization Header fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }

        return authorizationHeader.split(' ')[1] as string; // Token extrahieren
    }
}
