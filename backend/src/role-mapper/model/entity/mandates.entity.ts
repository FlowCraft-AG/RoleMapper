import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Definiert das Schema für die Function-Entität.
 */

/**
 * Repräsentiert eine Function-Entität in der Datenbank.
 * Hebt hervor, dass die Funktion eine bestimmte Autorität oder Aufgabe beinhaltet.
 *
 * @schema Functions
 */
@Schema({ collection: 'Functions' })
export class Mandates extends Document {
    /** Der Name der Funktion (z. B. "Professor"). */
    @Prop({ required: true })
    functionName!: string;

    /** Benutzer, die mit dieser Funktion verknüpft sind. */
    @Prop({ type: [String], required: true })
    users!: string[];

    /** Organisationseinheit, der die Funktion zugeordnet ist. */
    @Prop({ required: true })
    orgUnit!: string;
}

export type MandateDocument = Mandates & Document;
export const MANDATE_SCHEMA = SchemaFactory.createForClass(Mandates);
