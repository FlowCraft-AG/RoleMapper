import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { WriteService } from '../service/write.service.js';
import { User } from '../model/entity/user.entity.js';


@Resolver(() => User)
export class MutationResolver {
  constructor(private readonly userService: WriteService) { }

    @Mutation(() => User)
    async createUser(@Args('userData') userData: Partial<User>): Promise < User > {
      return this.userService.create(userData);
    }

    @Mutation(() => User, { nullable: true })
    async updateUser(
      @Args('id') id: string,
      @Args('updateData') updateData: Partial<User>,
    ): Promise < User | null > {
      return this.userService.updateById(id, updateData);
    }

    @Mutation(() => User, { nullable: true })
    async deleteUser(@Args('id') id: string): Promise < User | null > {
      return this.userService.deleteById(id);
    }
  }

