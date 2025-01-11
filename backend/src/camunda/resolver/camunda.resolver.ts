/**
 * @file camunda-api.ts
 * @description GraphQL-Resolver für die Camunda Platform API. Stellt Abfragen zur Verfügung,
 * um Aufgaben, Prozessinstanzen und Prozessdefinitionen zu verarbeiten.
 */

import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { CamundaReadService } from '../service/camunda.service.js';
import {
    ProcessFilterInput,
    TaskSearchRequest,
    VariableFilterInput,
} from '../types/input/process-filter.Input.js';
import { ProcessInstance, ProcessVariable, Task } from '../types/process.type.js';

type GraphQLContext = {
    req: {
        headers: {
            authorization?: string;
        };
    };
};

/**
 * GraphQL-Resolver für die Interaktion mit der Camunda Platform API.
 */
@Resolver()
export class CamundaResolver {
    readonly #logger = getLogger(CamundaResolver.name);
    readonly #camundaService: CamundaReadService;

    /**
     * Konstruktor für den CamundaResolver.
     *
     * @param {CamundaReadService} camundaService - Service für die Kommunikation mit der Camunda API.
     */
    constructor(camundaService: CamundaReadService) {
        this.#camundaService = camundaService;
    }

    /**
     * Ruft die Prozessinstanzen eines Benutzers ab.
     *
     * @param {string} userId - ID des Benutzers.
     * @param {GraphQLContext} context - GraphQL-Kontext mit Authorization-Header.
     * @returns {Promise<ProcessInstance[]>} Eine Liste von Prozessinstanzen.
     *
     * @example
     * ```graphql
     * query {
     *   getProcessesByUserId(userId: "user1234") {
     *     id
     *     state
     *     businessKey
     *   }
     * }
     * ```
     */
    @Query('getProcessesByUserId')
    @Public()
    async getProcessInstancesByUserId(
        @Args('userId') userId: string,
        @Context() context: GraphQLContext,
    ): Promise<ProcessInstance[]> {
        this.#logger.debug('getProcessInstancesByUserId: userId=%s', userId);

        const token = this.#extractToken(context);
        const userTasks = await this.#fetchUserTasks(userId, token);

        const processInstances = await this.#fetchProcessInstancesByKeys(
            userTasks.map((task) => task.processInstanceKey),
            token,
        );

        this.#logger.debug('getProcessInstancesByUserId: processInstances=%o', processInstances);
        return processInstances;
    }

    @Query('getCamundaProcesses')
    @Public()
    async getProzessListe(
        @Args('filter') filter: ProcessFilterInput,
        @Context() context: GraphQLContext,
    ) {
        this.#logger.debug('getProzessListe: filter=%o', filter);

        const token = this.#extractToken(context);
        const instances = await this.#camundaService.fetchProcessInstances(filter, token);

        this.#logger.debug('getProzessListe: instances=%o', instances);
        return instances;
    }

    @Query('getTasks')
    @Public()
    async getTasks(@Args('filter') filter: ProcessFilterInput, @Context() context: GraphQLContext) {
        this.#logger.debug('getTasks: filter=%o', filter);

        const token = this.#extractToken(context);
        const tasks = await this.#camundaService.fetchProcessTasks(filter, token);

        this.#logger.debug('getTasks: tasks=%o', tasks);
        return tasks;
    }

    @Public()
    @Query('searchTaskVariables')
    async getTaskVariables(
        @Args('filter') filter: VariableFilterInput,
        @Context() context: GraphQLContext,
    ): Promise<ProcessVariable[]> {
        this.#logger.debug('getTaskVariables: Filter: %o', filter);

        const token = this.#extractToken(context);
        const variables = await this.#camundaService.fetchProcessVariables(filter, token);

        this.#logger.debug('getTaskVariables: variables=%o', variables);
        return variables;
    }

    @Public()
    @Query('getProcessDefinitionXmlByKey')
    async getProcessDefinitionXmlByKey(
        @Args('processDefinitionKey') key: string,
        @Context() context: GraphQLContext,
    ): Promise<string> {
        this.#logger.debug('getProcessDefinitionXmlByKey: processDefinitionKey=%s', key);

        const token = this.#extractToken(context);
        const xml = await this.#camundaService.fetchProcessDefinitionXml(key, token);

        this.#logger.debug('getProcessDefinitionXmlByKey: xml=%s', xml);
        return xml;
    }

    /**
     * Extrahiert das Bearer-Token aus dem Authorization-Header des Kontextes.
     *
     * @private
     * @param {GraphQLContext} context - GraphQL-Kontext mit Request-Headern.
     * @returns {string} Das extrahierte Bearer-Token.
     * @throws {Error} Wenn der Authorization-Header fehlt oder ungültig ist.
     */
    #extractToken(context: GraphQLContext): string {
        // Bearer-Token aus dem Header extrahieren
        const authorizationHeader = context.req.headers.authorization;

        if (authorizationHeader?.startsWith('Bearer ') === undefined) {
            this.#logger.error('Authorization Header fehlt oder ist ungültig.');
            throw new Error('Authorization Header fehlt oder ist ungültig.');
        }

        return authorizationHeader.split(' ')[1]!; // Token extrahieren
    }

    /**
     * Holt Aufgaben eines Benutzers basierend auf der Benutzer-ID.
     */
    async #fetchUserTasks(userId: string, token: string): Promise<Task[]> {
        const filter: TaskSearchRequest = { assignee: userId };
        this.#logger.debug('#fetchUserTasks: filter=%o', filter);

        const tasks = await this.#camundaService.fetchProcessTasks(filter, token);
        this.#logger.debug('#fetchUserTasks: tasks=%o', tasks);

        return tasks;
    }

    /**
     * Holt Prozessinstanzen basierend auf einer Liste von Schlüsseln.
     */
    async #fetchProcessInstancesByKeys(keys: string[], token: string): Promise<ProcessInstance[]> {
        this.#logger.debug('#fetchProcessInstancesByKeys: keys=%o', keys);

        const processInstances: ProcessInstance[] = [];
        for (const key of keys) {
            const filter: ProcessFilterInput = { filter: { processInstanceKey: key } };
            const instances = await this.#camundaService.fetchProcessInstances(filter, token);
            if (instances.length > 0 && instances[0] !== undefined) {
                processInstances.push(instances[0]);
            }
        }

        this.#logger.debug('#fetchProcessInstancesByKeys: processInstances=%o', processInstances);
        return processInstances;
    }
}
