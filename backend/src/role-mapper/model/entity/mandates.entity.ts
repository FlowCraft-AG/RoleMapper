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
    @Prop({
        required: true,
        trim: true,
        validate: {
            validator: async function (value: string): Promise<boolean> {
                const normalizedValue = value.toLowerCase();
                const existing = await this.constructor
                    .findOne({
                        functionName: normalizedValue,
                        orgUnit: this.orgUnit,
                    })
                    .collation({ locale: 'en', strength: 2 }); // Case-Insensitive Suche
                return !existing; // Existiert bereits -> Fehler
            },
            message: 'Eine Funktion mit diesem Namen existiert bereits (case-insensitive).',
        },
    })
    functionName!: string;

    /** Benutzer, die mit dieser Funktion verknüpft sind. */
    @Prop({
        type: [String],
        required: true,
        validate: {
            validator: (users: string[]) => {
                if (!Array.isArray(users)) return false;
                const normalizedUsers = users.map((user) => user.toLowerCase());
                return new Set(normalizedUsers).size === normalizedUsers.length;
            },
            message:
                'Das users-Array darf keine doppelten Werte enthalten (Groß-/Kleinschreibung wird ignoriert).',
        },
    })
    users!: string[];

    /** Organisationseinheit, der die Funktion zugeordnet ist. */
    @Prop({ required: true })
    orgUnit!: string;

    /** Kennzeichnet, ob der Mandant ein Einzelbenutzer-Mandant ist. */
    @Prop({ required: true, default: false })
    isSingleUser!: boolean;
}

export type MandateDocument = Mandates & Document;
export const MANDATE_SCHEMA = SchemaFactory.createForClass(Mandates);

// Definiere den Compound Index
MANDATE_SCHEMA.index(
    { functionName: 1, orgUnit: 1 },
    {
        unique: true,
        collation: { locale: 'en', strength: 2 }, // Groß-/Kleinschreibung ignorieren
    },
);
