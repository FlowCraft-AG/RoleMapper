import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class writeController {
  constructor(private readonly userService: UserService) { }
  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.create(userData);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User | null> {
    return this.userService.updateById(id, updateData);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<User | null> {
    return this.userService.deleteById(id);
  }
}
