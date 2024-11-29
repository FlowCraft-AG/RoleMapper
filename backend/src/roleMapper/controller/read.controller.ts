import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReadService } from '../service/read.service.js';
import { User } from '../model/entity/user.entity.js';
import { FilterQuery } from 'mongoose';

@Controller('users')
export class ReadController {
  constructor(private readonly userService: ReadService) { }

  @Get()
  async findAll(@Query() filters: FilterQuery<User>): Promise<User[]> {
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
