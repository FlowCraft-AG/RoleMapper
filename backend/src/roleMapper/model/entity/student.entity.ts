import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop()
  id!: string;

  @Prop()
  courseOfStudy!: string;

  @Prop()
  courseOfStudyUnique!: string;

  @Prop()
  courseOfStudyShort!: string;

  @Prop()
  courseOfStudyName!: string;

  @Prop()
  level!: string;

  @Prop()
  examRegulation!: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
