import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PipelineStage } from 'mongoose';

/**
 * Definiert das Schema für die Role-Entität.
 */
@Schema({ collection: 'Roles' })
export class Role extends Document {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: false })
    roleId?: string;

    @Prop({ type: [Object], required: false })
    query?: PipelineStage[];
}

export type RoleDocument = Role & Document;
export const ROLE_SCHEMA = SchemaFactory.createForClass(Role);
