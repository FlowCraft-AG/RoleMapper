import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Definiert das Schema für die Role-Entität innerhalb eines Prozesses.
 */
class Role {
    @Prop({ required: true })
    roleKey!: string;

    @Prop({ required: true })
    roleId!: string;
}

/**
 * Definiert das Schema für die Process-Entität.
 */
@Schema({ collection: 'Processes' })
export class Process extends Document {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    processId!: string;

    @Prop({ type: [Role], required: true })
    roles!: Role[];
}

export type ProcessDocument = Process & Document;
export const ProcessSchema = SchemaFactory.createForClass(Process);
