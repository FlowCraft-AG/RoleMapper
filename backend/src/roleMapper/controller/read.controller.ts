import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class ReadController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(@Query() filters: Partial<User>): Promise<User[]> {
    return this.userService.findAll(filters);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Get('userId/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<User | null> {
    return this.userService.findByUserId(userId);
  }
}
