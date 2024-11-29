import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { getLogger } from '../../logger/logger.js';

@Injectable()
export class ReadService {
  readonly #logger = getLogger(ReadService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  /**
   * Findet alle Benutzer mit optionalen Filtern.
   * @param filters Ein Objekt mit Filtern (z. B. { userId: '123', active: true }).
   * @returns Eine Liste von Benutzern.
   */
  async findAll(filters: FilterQuery<User> = {}): Promise<User[]> {
    this.#logger.debug('ReadService: alle');
    const users = await this.userModel.find(filters).exec();
    this.#logger.debug('ReadService: users=%o', users.length);
    return users;

  }

  /**
   * Findet einen Benutzer nach ID.
   * @param id Die ID des Benutzers.
   * @returns Der Benutzer oder `null`.
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * Findet einen Benutzer nach der userId.
   * @param userId Die userId des Benutzers.
   * @returns Der Benutzer oder `null`.
   */
  async findByUserId(userId: string): Promise<User | null> {
    return this.userModel.findOne({ userId }).exec();
  }
}
