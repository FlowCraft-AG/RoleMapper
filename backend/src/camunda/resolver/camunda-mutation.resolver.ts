/**
 * @file camunda.resolver.ts
 * @description
 * GraphQL-Resolver für die Camunda Platform API. Stellt Abfragen und Mutationen
 * bereit, um Aufgaben, Prozessinstanzen und Prozessdefinitionen zu verwalten.
 * Dieser Resolver verwendet Authentifizierung, Logging und Fehlerbehandlung.
 */

import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard, Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { HttpExceptionFilter } from '../../role-mapper/utils/http-exception.filter.js';
import { CamundaWriteService } from '../service/camunda-write.service.js';
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
export class CamundaMutationResolver {
    /**
     * Logger-Instanz zur Protokollierung von Resolver-Aktivitäten.
     * @private
     */
    readonly #logger = getLogger(CamundaMutationResolver.name);
    /**
     * Service für den Zugriff auf die Camunda API.
     * @private
     */
    readonly #camundaMutationService: CamundaWriteService;

    /**
     * Konstruktor für den CamundaResolver.
     *
     * @param {CamundaReadService} camundaService - Service für die Kommunikation mit der Camunda API.
     */
    constructor(camundaService: CamundaWriteService) {
        this.#camundaMutationService = camundaService;
    }

    @Public()
    @Mutation('deleteProcessInstance')
    async deleteProcessInstance(
        @Args('processInstanceKey') key: string,
        @Context() context: GraphQLContext,
    ): Promise<string> {
        this.#logger.debug('deleteProcessInstance: processDefinitionKey=%s', key);

        const token = this.#extractToken(context);
        const message = await this.#camundaMutationService.deleteProcessInstance(key, token);

        this.#logger.debug('deleteProcessInstance: %s', message);
        return message;
    }

    @Public()
    @Mutation('completeUserTask')
    async completeUserTask(
        @Args('taskId') taskId: string,
        @Args('variables', { nullable: true }) variables: Record<string, any>,
        @Context() context: GraphQLContext,
    ): Promise<Task> {
        this.#logger.debug('completeUserTask: taskId=%s', taskId);

        const token = this.#extractToken(context);
        const result = await this.#camundaMutationService.completeUserTask(
            taskId,
            token,
            variables,
        );

        this.#logger.debug('completeUserTask: Task abgeschlossen: %s', result);
        return result;
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
}
