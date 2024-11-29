import { Resolver, Query, Args } from '@nestjs/graphql';
import { ReadService } from '../service/read.service.js';
import { User } from '../model/entity/user.entity.js';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';

@Resolver('RoleMapper')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class QueryResolver {
  readonly #service: ReadService;

  readonly #logger = getLogger(QueryResolver.name);
  constructor(service: ReadService) {
    this.#service = service;
  }

  @Query('users')
  @Public()
  async users(@Args('filters', { nullable: true }) filters?: Partial<User>): Promise<User[]> {
    this.#logger.debug('users: called');
    this.#logger.debug('users: filters=%o', filters);
    return this.#service.findAll(filters);
  }

  @Query('userById')
  @Public()
  async userById(@Args('id') id: string): Promise<User | null> {
    return this.#service.findById(id);
  }

  @Query('userByUserId')
  @Public()
  async userByUserId(@Args('userId') userId: string): Promise<User | null> {
    return this.#service.findByUserId(userId);
  }
}
