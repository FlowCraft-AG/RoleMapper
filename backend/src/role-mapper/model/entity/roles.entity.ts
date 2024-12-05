import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Definiert das Schema für die Role-Entität.
 */
@Schema({ collection: 'Roles' })
export class Role extends Document {
    /**
     * Der Name der Rolle.
     *
     * @type {string}
     * @memberof Role
     * @required
     */
    @Prop({ required: true })
    name!: string;

    /**
     * Die eindeutige Kennung für die Rolle.
     *
     * @type {string}
     * @memberof Role
     * @optional
     */
    @Prop({ required: false })
    roleId?: string;

    /**
     * Die Abfrage-Pipeline-Stufen, die mit der Rolle verbunden sind.
     */
}

export type RoleDocument = Role & Document;
export const ROLE_SCHEMA = SchemaFactory.createForClass(Role);
