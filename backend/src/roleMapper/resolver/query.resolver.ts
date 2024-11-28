import { Resolver, Query, Args } from '@nestjs/graphql';
import { ReadService } from '../service/read.service.js';
import { User } from '../model/entity/user.entity.js';

@Resolver(() => User)
export class QueryResolver {
  constructor(private readonly userService: ReadService) { }

  @Query(() => [User])
  async users(@Args('filters', { nullable: true }) filters?: Partial<User>): Promise<User[]> {
    return this.userService.findAll(filters);
  }

  @Query(() => User, { nullable: true })
  async userById(@Args('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Query(() => User, { nullable: true })
  async userByUserId(@Args('userId') userId: string): Promise<User | null> {
    return this.userService.findByUserId(userId);
  }
}
