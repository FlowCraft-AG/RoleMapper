import { Controller, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { User } from '../model/entity/user.entity.js';
import { WriteService } from '../service/write.service.js';

@Controller('users')
export class writeController {
  constructor(private readonly userService: WriteService) { }
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
