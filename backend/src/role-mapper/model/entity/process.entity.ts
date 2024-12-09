import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Definiert das Schema für die Role-Entität innerhalb eines Prozesses.
 */
class Role {
    /** Schlüssel der Rolle (z. B. "Reviewer"). */
    @Prop({ required: true })
    roleKey!: string;

    /** Eindeutige ID der Rolle. */
    @Prop({ required: true })
    roleId!: string;
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
    @Prop({ type: [Role], required: true })
    roles!: Role[];
}

export type ProcessDocument = Process & Document;
export const PROCESS_SCHEMA = SchemaFactory.createForClass(Process);
