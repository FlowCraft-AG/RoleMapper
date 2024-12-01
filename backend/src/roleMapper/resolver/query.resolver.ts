import { BadRequestException, UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { ReadService } from '../service/read.service.js';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { FilterDTO } from '../model/dto/filter.dto.js';

/**
 * Enum der unterstützten Entitäten für dynamische Abfragen.
 */
export type SupportedEntities = 'USERS' | 'FUNCTIONS' | 'PROCESSES' | 'ROLES' | 'ORG_UNITS';

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
    this.#logger.debug(`getRole: processId=${processId}, userId=${userId}`);
    return this.#service.findProcessRoles(processId, userId);
  }

  /**
   * Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.
   * @param {SupportedEntities} entity - Die Ziel-Entität (z. B. USERS, FUNCTIONS).
   * @param {FilterDTO} [filters] - Dynamische Filterkriterien.
   * @returns {Promise<any[]>} - Die gefilterten Daten.
   * @throws {BadRequestException} - Wenn die Entität nicht unterstützt wird.
   */
  @Query(() => [Object])
  @Public()
  async getData(
    @Args('entity') entity: SupportedEntities,
    @Args('filters', { nullable: true }) filters?: FilterDTO,
  ): Promise<any[]> {
    this.logDebug(entity, filters);

    try {
      this.#logger.debug('getData: entity=%s, filters=%o', entity, filters);
      return await this.#service.findData(entity, filters);
    } catch (error) {
      this.#logger.error(`getData: Fehler bei der Verarbeitung von ${entity}`, error);
      throw new BadRequestException(`Fehler bei der Verarbeitung von ${entity}`);
    }
  }

  /**
   * Protokolliert Debug-Informationen.
   * @param {SupportedEntities} entity - Die Ziel-Entität.
   * @param {FilterDTO} [filters] - Die Filterkriterien.
   */
  private logDebug(entity: SupportedEntities, filters?: FilterDTO): void {
    this.#logger.debug(`[QueryResolver] getData aufgerufen mit entity=${entity}`);
    if (filters) {
      this.#logger.debug(`[QueryResolver] Filters:`, JSON.stringify(filters, null, 2));
    }
  }
}
