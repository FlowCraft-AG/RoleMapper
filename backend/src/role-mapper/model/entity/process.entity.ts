import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type RoleType = 'COLLECTION' | 'IMPLICITE_FUNCTION' | 'IMPLICITE_ORG_UNIT';

/**
 * Definiert das Schema für die Role-Entität innerhalb eines Prozesses.
 */
export class ShortRole {
    /** Schlüssel der Rolle (z. B. "Reviewer"). */
    @Prop({ required: true })
    roleName!: string;

    /** Eindeutige ID der Rolle. */
    @Prop({ required: true })
    roleId!: string;

    /** Typ der Rolle (z. B. "COLLECTION"). */
    @Prop({ required: true })
    roleType!: RoleType;
}

/**
 * Definiert das Schema für die Process-Entität.
 */
/**
 * Repräsentiert einen Prozess in der Datenbank.
 *
 * @schema Processes - Die Sammlung, in der die Prozesse gespeichert werden.
 */
@Schema({ collection: 'Processes' })
export class Process extends Document {
    /**
     * Der Name des Prozesses.
     * (z. B. "Reisegenehmigung")
     *
     * @type {string}
     * @required
     */
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    parentId!: string;

    /**
     * Die eindeutige ID des Prozesses.
     *
     * @type {string}
     * @required
     */
    @Prop({ required: true })
    processId!: string;

    /**
     * Die Rollen, die dem Prozess zugeordnet sind.
     * Liste der Rollen, die dem Prozess zugeordnet sind.
     *
     * @type {Role[]}
     * @required
     */
    @Prop({ type: [ShortRole], required: true })
    roles!: ShortRole[];
}

export type ProcessDocument = Process & Document;
export const PROCESS_SCHEMA = SchemaFactory.createForClass(Process);
