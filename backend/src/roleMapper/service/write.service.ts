import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/entity/user.entity.js';

@Injectable()
export class WriteService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

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
