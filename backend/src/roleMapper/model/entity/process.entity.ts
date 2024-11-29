import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Processes' })
export class Process extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  pid!: string;

  @Prop({ type: Object, required: true })
  queries!: Record<string, any>;
}

export type ProcessDocument = Process & Document;
export const ProcessSchema = SchemaFactory.createForClass(Process);
