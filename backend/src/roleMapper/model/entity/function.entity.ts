import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Functions' })
export class Function extends Document {
  @Prop({ required: true })
  functionName!: string;

  @Prop({ type: [String], required: true })
  users!: string[];

  @Prop({ type: String, required: true })
  orgUnit!: string;
}

export type FunctionDocument = Function & Document;
export const FunctionSchema = SchemaFactory.createForClass(Function);
