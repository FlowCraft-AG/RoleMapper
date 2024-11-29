import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Student, StudentSchema } from './student.entity.js';
import { Employee, EmployeeSchema } from './employee.entity.js';
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ collection: 'HKA_Users', timestamps: true })
export class User {
  @Transform(({ value }) => value?.toString())
  @Prop({ type: String })
  _id!: string;

  @Prop({ required: true, unique: true })
  userId!: string;

  @Prop({ required: true})
  userType!: String;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
