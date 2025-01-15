/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/operator-linebreak */
/**
 * @file camunda.resolver.ts
 * @description
 * GraphQL-Resolver für die Camunda Platform API. Stellt Abfragen und Mutationen
 * bereit, um Aufgaben, Prozessinstanzen und Prozessdefinitionen zu verwalten.
 * Dieser Resolver verwendet Authentifizierung, Logging und Fehlerbehandlung.
 */

import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard, Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { HttpExceptionFilter } from '../../role-mapper/utils/http-exception.filter.js';
import { CamundaReadService } from '../service/camunda-read.service.js';
import { FlowNodeFilter } from '../types/input-filter/flownode-filter.js';
import { IncidentFilter } from '../types/input-filter/incident-filter.js';
import { ProcessInstanceFilter } from '../types/input-filter/process-instance-filter.js';
import { TaskFilter } from '../types/input-filter/task-filter.js';
import { VariableFilter } from '../types/input-filter/variable-filter.js';
import { ProcessInstance } from '../types/process-instance.type.js';
import { ProcessVariable } from '../types/process-variable.type.js';
import { Task } from '../types/task.type.js';

/**
 * Typ für den GraphQL-Kontext, der in Resolvern verwendet wird.
 * Enthält Informationen über den eingehenden HTTP-Request.
 */
export type GraphQLContext = {
    /**
     * HTTP-Request-Objekt, das vom GraphQL-Server bereitgestellt wird.
     */
    req: {
        /**
         * HTTP-Header des eingehenden Requests.
         * Der `authorization`-Header ist optional, wird jedoch benötigt,
         * um das Bearer-Token zu extrahieren.
         */
        headers: {
            authorization?: string;
        };
    };
};

/**
 * GraphQL-Resolver für die Verarbeitung von Anfragen an die Camunda Platform API.
 *
 * Dieser Resolver unterstützt:
 * - Abfragen von Aufgaben
 * - Abruf von Prozessinstanzen
 * - Zugriff auf Prozessdefinitionen
 *
 * Alle Anfragen nutzen:
 * - Authentifizierung über Keycloak
 * - Logging
 * - Fehlerbehandlung
 */
@Resolver()
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class CamundaQueryResolver {
    /**
     * Logger-Instanz zur Protokollierung von Resolver-Aktivitäten.
     * @private
     */
    readonly #logger = getLogger(CamundaQueryResolver.name);
    /**
     * Service für den Zugriff auf die Camunda API.
     * @private
     */
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
     * **Prozessinstanzen eines Benutzers abrufen**
     *
     * Ruft die Prozessinstanzen ab, die einem bestimmten Benutzer zugeordnet sind.
     *
     * @param {string} userId - ID des Benutzers, dessen Prozessinstanzen abgerufen werden sollen.
     * @param {GraphQLContext} context - GraphQL-Kontext mit den Request-Headern.
     * @returns {Promise<ProcessInstance[]>} Liste der Prozessinstanzen des Benutzers.
     *
     * @example
     * ```graphql
     * query {
     *   getProcessesByUserId(userId: "user1234") {
     *     key
     *     processVersion
     *     bpmnProcessId
     *     startDate
     *     state
     *     incident
     *     processDefinitionKey
     *     tenantId
     *   }
     * }
     * ```
     */
    @Query('getProcessInstancesByUserId')
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

    /**
     * **Prozessinstanzen filtern**
     *
     * Ruft Prozessinstanzen basierend auf den angegebenen Filterkriterien ab.
     *
     * @param {ProcessFilterInput} filter - Filterkriterien für die Prozessinstanzen.
     * @param {GraphQLContext} context - GraphQL-Kontext mit den Request-Headern.
     * @returns {Promise<ProcessInstance[]>} Liste der gefilterten Prozessinstanzen.
     *
     * @example
     * ```graphql
     * query {
     *   getCamundaProcesses(filter: { filter: { state: "ACTIVE" } }) {
     *     key
     *     processVersion
     *     bpmnProcessId
     *     startDate
     *     state
     *     incident
     *     processDefinitionKey
     *     tenantId
     *   }
     * }
     * ```
     */
    @Query('getCamundaProcesses')
    @Public()
    async getProzessListe(
        @Args('filter') filter: ProcessInstanceFilter,
        @Context() context: GraphQLContext,
    ): Promise<ProcessInstance[]> {
        this.#logger.debug('getProzessListe: filter=%o', filter);

        const token = this.#extractToken(context);
        const instances = await this.#camundaService.fetchProcessInstances(filter, token);

        this.#logger.debug('getProzessListe: instances=%o', instances);
        return instances;
    }

    /**
     * **Aufgaben filtern**
     *
     * Ruft Aufgaben basierend auf den angegebenen Filterkriterien ab.
     *
     * @param {ProcessFilterInput} filter - Filterkriterien für die Aufgaben.
     * @param {GraphQLContext} context - GraphQL-Kontext mit den Request-Headern.
     * @returns {Promise<Task[]>} Liste der gefilterten Aufgaben.
     *
     * @example
     * ```graphql
     * query {
     *   getTasks(filter: { filter: { candidateUser: "user123" } }) {
     *     id
     *     name
     *     taskState
     *     assignee
     *     processDefinitionKey
     *     processInstanceKey
     *   }
     * }
     * ```
     */
    @Query('getTasks')
    @Public()
    async getTasks(
        @Args('filter') filter: TaskFilter,
        @Context() context: GraphQLContext,
    ): Promise<Task[]> {
        this.#logger.debug('getTasks: filter=%o', filter);

        const token = this.#extractToken(context);
        const tasks = await this.#camundaService.fetchProcessTasks(filter, token);

        this.#logger.debug('getTasks: tasks=%o', tasks);
        return tasks;
    }

    /**
     * **Variablen einer Aufgabe suchen**
     *
     * Ruft Variablen basierend auf den angegebenen Filterkriterien ab.
     *
     * @param {VariableFilterInput} filter - Filterkriterien für die Variablen.
     * @param {GraphQLContext} context - GraphQL-Kontext mit den Request-Headern.
     * @returns {Promise<ProcessVariable[]>} Liste der gefundenen Variablen.
     *
     * @example
     * ```graphql
     * query {
     *   searchTaskVariables(filter: { filter: { name: "variableName" } }) {
     *     key
     *     name
     *     value
     *     type
     *     truncated
     *     tenantId
     *   }
     * }
     * ```
     */
    @Public()
    @Query('searchTaskVariables')
    async getTaskVariables(
        @Args('filter') filter: VariableFilter,
        @Context() context: GraphQLContext,
    ): Promise<ProcessVariable[]> {
        this.#logger.debug('getTaskVariables: Filter: %o', filter);

        const token = this.#extractToken(context);
        const variables = await this.#camundaService.fetchProcessVariables(filter, token);

        this.#logger.debug('getTaskVariables: variables=%o', variables);
        return variables;
    }

    /**
     * **XML-Definition einer Prozessdefinition abrufen**
     *
     * Ruft die XML-Definition einer bestimmten Prozessdefinition ab.
     *
     * @param {string} key - Schlüssel der Prozessdefinition.
     * @param {GraphQLContext} context - GraphQL-Kontext mit den Request-Headern.
     * @returns {Promise<string>} XML-Definition der Prozessdefinition.
     *
     * @example
     * ```graphql
     * query {
     *   getProcessDefinitionXmlByKey(processDefinitionKey: "process123") {
     *     xml
     *   }
     * }
     * ```
     */

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

    @Public()
    @Query('getIncidentFlowNodeByProcessInstanceKey')
    async getIncidentFlowNodeByProcessInstanceKey(
        @Args('processInstanceKey') key: string,
        @Context() context: GraphQLContext,
    ): Promise<string> {
        this.#logger.debug('getIncidentFlowNodeByProcessInstanceKey: processInstanceKey=%s', key);

        const token = this.#extractToken(context);
        const incidentFilter: IncidentFilter = { processInstanceKey: key };
        const incidents = await this.#camundaService.fetchIncidents(incidentFilter, token);
        this.#logger.debug('getIncidentFlowNodeByProcessInstanceKey: incidents=%o', incidents);

        if (incidents.length === 0 || incidents[0] === undefined) {
            this.#logger.debug(
                'getIncidentFlowNodeByProcessInstanceKey: Kein Incident gefunden. für den Prozess mit dem Schlüssel %s',
                key,
            );
            return '';
        }

        const incident = incidents[0];

        const flowNodeFilter: FlowNodeFilter = { incidentKey: incident?.key };
        const flowNodes = await this.#camundaService.fetchFlowNodes(flowNodeFilter, token);
        this.#logger.debug('getIncidentFlowNodeByProcessInstanceKey: flowNodes=%o', flowNodes);

        if (flowNodes.length === 0 || flowNodes[0] === undefined) {
            this.#logger.debug(
                'getIncidentFlowNodeByProcessInstanceKey: Keine FlowNode gefunden. für den Incident mit dem Schlüssel %s',
                incident?.key,
            );
            return '';
        }

        const flowNode = flowNodes[0];

        const incidentTaskId = flowNode.flowNodeId;
        this.#logger.debug(
            'getIncidentFlowNodeByProcessInstanceKey: incidentTaskId=%s',
            incidentTaskId,
        );
        return incidentTaskId;
    }

    /**
     * **Bearer-Token extrahieren**
     *
     * Extrahiert das Bearer-Token aus dem `Authorization`-Header des Requests.
     *
     * @private
     * @param {GraphQLContext} context - GraphQL-Kontext mit den Request-Headern.
     * @returns {string} Das extrahierte Bearer-Token.
     *
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
     *
     * @private
     * @param {string} userId - Die Benutzer-ID, für die Aufgaben abgerufen werden sollen.
     * @param {string} token - Der Bearer-Token für die Authentifizierung.
     * @returns {Promise<Task[]>} Eine Liste der Aufgaben des Benutzers.
     */
    async #fetchUserTasks(userId: string, token: string): Promise<Task[]> {
        const filter1: TaskFilter = { assignee: userId };
        const filter2: TaskFilter = { candidateUser: userId };

        this.#logger.debug('#fetchUserTasks: filter1=%o, filter2=%o', filter1, filter2);

        // Parallel Anfragen senden
        const [tasks1, tasks2] = await Promise.all([
            this.#camundaService.fetchProcessTasks(filter1, token),
            this.#camundaService.fetchProcessTasks(filter2, token),
        ]);

        // Aufgaben kombinieren und Duplikate entfernen
        const combinedTasks: Task[] = [];
        const taskMap: Record<string, boolean> = {};

        for (const task of [...tasks1, ...tasks2]) {
            if (!(taskMap[task.id] ?? false)) {
                taskMap[task.id] = true;
                combinedTasks.push(task);
            }
        }

        this.#logger.debug('#fetchUserTasks: combinedTasks=%o', combinedTasks);
        return combinedTasks;
    }

    /**
     * Holt Prozessinstanzen basierend auf einer Liste von Schlüsseln.
     *
     * @private
     * @param {string[]} keys - Die Liste der Prozessinstanz-Schlüssel.
     * @param {string} token - Der Bearer-Token für die Authentifizierung.
     * @returns {Promise<ProcessInstance[]>} Eine Liste der Prozessinstanzen.
     */
    async #fetchProcessInstancesByKeys(keys: string[], token: string): Promise<ProcessInstance[]> {
        this.#logger.debug('#fetchProcessInstancesByKeys: keys=%o', keys);

        const processInstances: ProcessInstance[] = [];
        const bekannteInstanzIds = new Set<string>(); // Set, um Duplikate zu vermeiden = new Set<string>(); // Set, um Duplikate zu vermeiden
        for (const key of keys) {
            const filter: ProcessInstanceFilter = { key: key };
            const instanzen = await this.#camundaService.fetchProcessInstances(filter, token);

            // Jede Instanz prüfen und hinzufügen, falls sie noch nicht bekannt is
            for (const instanz of instanzen) {
                if (
                    instanzen.length > 0 &&
                    instanzen[0] !== undefined &&
                    !bekannteInstanzIds.has(instanz.key)
                ) {
                    processInstances.push(instanzen[0]);
                    bekannteInstanzIds.add(instanz.key); // ID im Set speichern
                }
            }
        }

        this.#logger.debug('#fetchProcessInstancesByKeys: processInstances=%o', processInstances);
        return processInstances;
    }
}
