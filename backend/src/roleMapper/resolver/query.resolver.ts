import { Resolver, Query, Args } from '@nestjs/graphql';
import { ReadService } from '../service/read.service.js';
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

  @Query('users')
  @Public()
  async users(@Args('filters', { nullable: true }) filters?: FilterQuery<User>): Promise<User[]> {
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

  @Query(() => Process, { nullable: true })
  @Public()
  async processById(@Args('id') id: string): Promise<Process | null> {
    return this.#service.findProcessByPid(id);
  }

  @Query(() => Object, { nullable: true })
  @Public()
  async executeQuery(
    @Args('processId') processId: string,
    @Args('queryKey') queryKey: string,
    @Args('userId') userId: string,
  ): Promise<any> {
    this.#logger.debug(`executeQuery: processId=${processId}, queryKey=${queryKey}`);
    return this.#service.führeAlleAbfragenAus(processId, userId);
  }
}
