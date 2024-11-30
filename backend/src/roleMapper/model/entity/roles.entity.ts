import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PipelineStage } from 'mongoose';

@Schema({ collection: 'Roles' })
export class Role extends Document {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: false })
    roleId!: string;

    @Prop({ required: false })
    query!: PipelineStage[];
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
