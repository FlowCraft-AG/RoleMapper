import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Definiert das Schema für die OrgUnit-Entität.
 */

/**
 * Repräsentiert eine Organisationseinheit innerhalb des Systems.
 *
 * @schema OrgUnit
 * @collection OrgUnits
 */
@Schema({ collection: 'OrgUnits' })
export class OrgUnit extends Document {
    /**
     * Der Name der Organisationseinheit.
     *
     * @prop {string} name - Der Name der Organisationseinheit. Dieses Feld ist erforderlich.
     */
    @Prop({ required: true })
    name!: string;

    /**
     * Die ID der übergeordneten Organisationseinheit.
     *
     * @prop {Types.ObjectId} [parentId] - Die ID der übergeordneten Organisationseinheit. Dieses Feld ist optional.
     */
    @Prop({ required: false })
    parentId?: Types.ObjectId;

    /**
     * Der Vorgesetzte der Organisationseinheit.
     *
     * @prop {string} [supervisor] - Der Vorgesetzte der Organisationseinheit. Dieses Feld ist optional.
     */
    @Prop({ required: false })
    supervisor?: string;
}

export type OrgUnitDocument = OrgUnit & Document;
export const ORG_UNIT_SCHEMA = SchemaFactory.createForClass(OrgUnit);
