import { Resolver, Query, Args } from '@nestjs/graphql';
import { FilterInput, ReadService } from '../service/read.service.js';
import { User } from '../model/entity/user.entity.js';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { FilterQuery } from 'mongoose';
import { Process } from '../model/entity/process.entity.js';

@Resolver('RoleMapper')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class QueryResolver {
  readonly #service: ReadService;

  readonly #logger = getLogger(QueryResolver.name);
  constructor(service: ReadService) {
    this.#service = service;
  }

  @Query('getUsers')
  @Public()
  async users(@Args('filters', { nullable: true }) filters?: FilterQuery<User>): Promise<User[]> {
    this.#logger.debug('users: called');
    this.#logger.debug('users: filters=%o', filters);
    return this.#service.findAll(filters);
  }

  @Query('getUserById')
  @Public()
  async userById(@Args('id') id: string): Promise<User | null> {
    return this.#service.findById(id);
  }

  @Query('getUserByUserId')
  @Public()
  async userByUserId(@Args('userId') userId: string): Promise<User | null> {
    return this.#service.findByUserId(userId);
  }

  @Query('getProcessById')
  @Public()
  async processById(@Args('id') id: string): Promise<Process | null> {
    return this.#service.findProcessByPid(id);
  }

  @Query('getProcessRoles')
  @Public()
  async getRole(
    @Args('processId') processId: string,
    @Args('userId') userId: string,
  ): Promise<any> {
    this.#logger.debug(`executeQuery: processId=${processId}, userId=${userId}`);
    return this.#service.führeAlleAbfragenAus(processId, userId);
  }

  /**
   * Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern
   * @param entity - Die Ziel-Entität (z. B. USERS, FUNCTIONS)
   * @param filters - Dynamische Filterkriterien
   */
  @Query(() => [Object])
  @Public()
  async getData(
    @Args('entity') entity: string, // Enum EntityType
    @Args('filters', { nullable: true }) filters?: FilterInput,
  ): Promise<any[]> {
    this.logDebug(entity, filters); // Debugging-Log für Eingaben
    return this.#service.filterData(entity, filters);
  }

  private logDebug(entity: string, filters?: FilterInput): void {
    console.debug(`[DataResolver] getData called with entity: ${entity}`);
    if (filters) {
      console.debug(`[DataResolver] Filters:`, JSON.stringify(filters, null, 2));
    }
  }
}
