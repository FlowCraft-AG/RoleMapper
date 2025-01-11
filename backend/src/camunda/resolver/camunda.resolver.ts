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
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;
        if (
            authorizationHeader === undefined ||
            authorizationHeader.startsWith('Bearer ') === undefined
        ) {
            this.#logger.error('Authorization Header fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }

        const token: string = authorizationHeader.split(' ')[1]; // Token extrahieren
        this.#logger.debug('Get tasks by userId: %s', userId);
        const tasks: Task[] = await this.#camundaService.findTasksByUserId(userId, token);
        this.#logger.debug('Tasks: %s', tasks);
        return tasks;
    }

    @Query('getProcessesByKey')
    @Public()
    async getProcessesByKey(
        @Args('key') key: string,
        @Context() context: any,
    ): Promise<ProcessInstance> {
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;
        if (
            authorizationHeader === undefined ||
            authorizationHeader.startsWith('Bearer ') === undefined
        ) {
            this.#logger.error('Authorization Header fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }
        const token: string = authorizationHeader.split(' ')[1]; // Token extrahieren
        this.#logger.debug('getProcessesByKey: Get process by processId:', key);
        const instanzen: ProcessInstance = await this.#camundaService.findProcessInstance(
            key,
            token,
        );
        this.#logger.debug('getProcessesByKey: ProcessInstance: %o', instanzen);
        return instanzen;
    }

    @Query('getProcessesByUserId')
    @Public()
    async getProcessesByUserId(
        @Args('userId') userId: string,
        @Context() context: any,
    ): Promise<ProcessInstance[]> {
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;
        if (
            authorizationHeader === undefined ||
            authorizationHeader.startsWith('Bearer ') === undefined
        ) {
            this.#logger.error('Authorization Header fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }
        const token: string = authorizationHeader.split(' ')[1]; // Token extrahieren
        this.#logger.debug('getProcessesByUserId: userId=%s', userId);
        const tasks: Task[] = await this.#camundaService.findTasksByUserId(userId, token);
        this.#logger.debug('getProcessesByUserId: Tasks=%o', tasks);
        const processInstanceKeys: string[] = tasks.map((task) => task.processInstanceKey);
        this.#logger.debug('ProcessInstanceKeys: prozessInstanzenKeys=%o', processInstanceKeys);
        const processInstances: ProcessInstance[] = [];
        for (const key of processInstanceKeys) {
            const instanz: ProcessInstance = await this.#camundaService.findProcessInstance(
                key,
                token,
            );
            processInstances.push(instanz);
        }
        this.#logger.debug('getProcessesByUserId: ProcessInstances=%o', processInstances);
        return processInstances;
    }

    @Query('getCamundaProcesses')
    @Public()
    async getProzessListe(@Args('filter') filter: ProcessFilterInput, @Context() context: any) {
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;
        if (
            authorizationHeader === undefined ||
            authorizationHeader.startsWith('Bearer ') === undefined
        ) {
            this.#logger.error('Authorization dHeader fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }
        const token: string = authorizationHeader.split(' ')[1]; // Token extrahieren
        this.#logger.debug('Get all processes');
        const instanzen: ProcessInstance[] = await this.#camundaService.findProzessListe(
            filter,
            token,
        );
        this.#logger.debug('getProzessListe: Instanzen: %o', instanzen);
        return instanzen;
    }

    @Query('getTasks')
    @Public()
    async getTasks(@Args('filter') filter: ProcessFilterInput, @Context() context: any) {
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;
        if (
            authorizationHeader === undefined ||
            authorizationHeader.startsWith('Bearer ') === undefined
        ) {
            this.#logger.error('Authorization Header fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }
        const token: string = authorizationHeader.split(' ')[1]; // Token extrahieren
        this.#logger.debug('Get all tasks');
        const instanzen: Task[] = await this.#camundaService.findTaskListe(filter, token);
        this.#logger.debug('getProzessListe: Instanzen: %o', instanzen);
        return instanzen;
    }

    @Public()
    @Query('searchTaskVariables')
    async searchTaskVariables(
        @Args('filter') filter: VariableFilterInput,
        @Context() context: any,
    ): Promise<ProcessVariable[]> {
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;
        if (
            authorizationHeader === undefined ||
            authorizationHeader.startsWith('Bearer ') === undefined
        ) {
            this.#logger.error('Authorization Header fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }
        const token: string = authorizationHeader.split(' ')[1]; // Token extrahieren

        // Anfrage an den Camunda-Service
        const variables = await this.#camundaService.searchTaskVariables(filter, token);

        this.#logger.debug('searchTaskVariables: Variablen: %o', variables);
        return variables;
    }

    @Public()
    @Query('getProcessDefinitionXmlByKey')
    async getProcessDefinitionXmlByKey(
        @Args('key') key: string,
        @Context() context: any,
    ): Promise<string> {
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;
        if (
            authorizationHeader === undefined ||
            authorizationHeader.startsWith('Bearer ') === undefined
        ) {
            this.#logger.error('Authorization Header fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }
        const token: string = authorizationHeader.split(' ')[1]; // Token extrahieren
        this.#logger.debug('Get process definition by key:', key);
        const xml = await this.#camundaService.getProcessDefinitionXmlByKey(key, token);
        this.#logger.debug('Process definition xml:', xml);
        return xml;
    }
}
