import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from '../enum/user-type.enum.js';
import { Student, StudentSchema } from './student.entity.js';
import { Employee, EmployeeSchema } from './employee.entity.js';
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ collection: 'HKA_Users_Orig', timestamps: true })
export class User {
  @Transform(({ value }) => value.toString()) // Transformiert ObjectId in String
  @Prop({ type: String })
  id!: string;

  @Prop({ required: true, unique: true })
  userId!: string;

  @Prop({ required: true, enum: UserType })
  userType!: UserType;

  @Prop({ required: true })
  userRole!: string;

  @Prop({ index: true })
  orgUnit!: string;

  @Prop({ index: true, default: false })
  active!: boolean;

  @Prop({ type: StudentSchema, required: false })
  student?: Student;

  @Prop({ type: EmployeeSchema, required: false })
  employee?: Employee;

  @Prop()
  validFrom?: Date;

  @Prop()
  validUntil?: Date;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;

  /**
   * Prüft, ob der Benutzer aktuell gültig ist.
   *
   * @return true, wenn der Benutzer gültig ist; false sonst.
   */
  isValidNow(): boolean {
    const now = new Date();
    return (!this.validFrom || now >= this.validFrom) &&
      (!this.validUntil || now <= this.validUntil);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
