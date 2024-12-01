import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Definiert das Schema für die OrgUnit-Entität.
 */
@Schema({ collection: 'OrgUnits' })
export class OrgUnit extends Document {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: false })
    parent_id?: Types.ObjectId;

    @Prop({ required: false })
    supervisor?: string;
}

export type OrgUnitDocument = OrgUnit & Document;
export const OrgUnitSchema = SchemaFactory.createForClass(OrgUnit);
