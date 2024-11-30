import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

// Subschema für Student
class Student {
    @Prop({ required: true })
    courseOfStudy!: string;

    @Prop({ required: true })
    courseOfStudyUnique!: string;

    @Prop({ required: true })
    courseOfStudyShort!: string;

    @Prop({ required: true })
    courseOfStudyName!: string;

    @Prop({ required: true })
    level!: string;

    @Prop({ required: true })
    examRegulation!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    _id!: mongoose.Types.ObjectId;
}

// Subschema für Employee
class Employee {
    @Prop({ required: true })
    costCenter!: string;

    @Prop({ required: true })
    department!: string;
}

// Main User Schema
@Schema({ timestamps: true, collection: 'HKA_Users' })
export class User extends Document {
    @Prop({ required: true })
    userId!: string;

    @Prop({ required: true })
    userType!: string;

    @Prop({ required: true })
    userRole!: string;

    @Prop({ required: true })
    orgUnit!: string;

    @Prop({ required: true, default: true })
    active!: boolean;

    @Prop({ type: Date, required: true })
    validFrom!: Date;

    @Prop({ type: Date, required: true })
    validUntil!: Date;

    @Prop({ type: Student, required: false })
    student?: Student;

    @Prop({ type: Employee, required: false })
    employee?: Employee;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
