import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { ReadService } from '../service/read.service.js';
import { FilterInput } from './filterInput.js';
import { HttpExceptionFilter } from './http-exception.filter.js';

@Resolver('RoleMapper')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class QueryResolver {
    readonly #service: ReadService;

    readonly #logger = getLogger(QueryResolver.name);
    constructor(service: ReadService) {
        this.#service = service;
    }

    /**
     * Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.
     * @param {string} processId - Die ID des Prozesses.
     * @param {string} userId - Die ID des Benutzers.
     * @returns {Promise<any>} - Die Rollen des Prozesses.
     */
    @Query('getProcessRoles')
    @Public()
    async getRole(
        @Args('processId') processId: string,
        @Args('userId') userId: string,
    ): Promise<any> {
        this.#logger.debug(`executeQuery: processId=${processId}, userId=${userId}`);
        return this.#service.findProcessRoles(processId, userId);
    }

    static readonly SUPPORTED_ENTITIES: string[] = [
        'USERS',
        'FUNCTIONS',
        'PROCESSES',
        'ROLES',
        'ORG_UNITS',
    ];

    /**
     * Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.
     * @param {string} entity - Die Ziel-Entität (z. B. USERS, FUNCTIONS).
     * @param {FilterInput} [filters] - Dynamische Filterkriterien.
     * @returns {Promise<any[]>} - Die gefilterten Daten.
     * @throws {Error} - Wenn die Entität nicht unterstützt wird.
     */
    @Query(() => [Object])
    @Public()
    async getData(
        @Args('entity') entity: string, // Enum EntityType
        @Args('filters', { nullable: true }) filters?: FilterInput,
    ): Promise<any[]> {
        if (!QueryResolver.SUPPORTED_ENTITIES.includes(entity)) {
            throw new Error(
                `Unsupported entity: ${entity}. Supported entities are: ${QueryResolver.SUPPORTED_ENTITIES.join(', ')}`,
            );
        }

        this.logDebug(entity, filters);
        return this.#service.findData(entity, filters);
    }

    /**
     * Protokolliert Debug-Informationen.
     * @param {string} entity - Die Ziel-Entität.
     * @param {FilterInput} [filters] - Die Filterkriterien.
     */
    private logDebug(entity: string, filters?: FilterInput): void {
        console.debug(`[DataResolver] getData called with entity: ${entity}`);
        if (filters) {
            console.debug(`[DataResolver] Filters:`, JSON.stringify(filters, null, 2));
        }
    }
}
