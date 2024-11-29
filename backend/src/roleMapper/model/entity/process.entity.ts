import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Processes' })
export class Process extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  processId!: string;

  @Prop({ type: Object, required: true })
  roles!: Role[];
}

class Role {
  @Prop({ required: true })
  roleKey!: string;

  @Prop({ required: true })
  roleId!: string;
}

export type ProcessDocument = Process & Document;
export const ProcessSchema = SchemaFactory.createForClass(Process);
