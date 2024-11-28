import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  /**
   * Findet alle Benutzer mit optionalen Filtern.
   * @param filters Ein Objekt mit Filtern (z. B. { userId: '123', active: true }).
   * @returns Eine Liste von Benutzern.
   */
  async findAll(filters: FilterQuery<User> = {}): Promise<User[]> {
    return this.userModel.find(filters).exec();
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

  /**
   * Erstellt einen neuen Benutzer.
   * @param userData Die Daten für den neuen Benutzer.
   * @returns Der erstellte Benutzer.
   */
  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  /**
   * Aktualisiert einen Benutzer nach ID.
   * @param id Die ID des zu aktualisierenden Benutzers.
   * @param updateData Die zu aktualisierenden Daten.
   * @returns Der aktualisierte Benutzer oder `null`, falls er nicht existiert.
   */
  async updateById(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  /**
   * Löscht einen Benutzer nach ID.
   * @param id Die ID des zu löschenden Benutzers.
   * @returns Der gelöschte Benutzer oder `null`, falls er nicht existiert.
   */
  async deleteById(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
