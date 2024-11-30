import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Definiert das Schema für die Function-Entität.
 */
@Schema({ collection: 'Functions' })
export class Function extends Document {
    @Prop({ required: true })
    functionName!: string;

    @Prop({ type: [String], required: true })
    users!: string[];

    @Prop({ required: true })
    orgUnit!: string;
}

export type FunctionDocument = Function & Document;
export const FunctionSchema = SchemaFactory.createForClass(Function);
