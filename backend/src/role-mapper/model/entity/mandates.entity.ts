/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FilterInput } from '../input/filter.input';
import { PaginationParameters } from '../input/pagination-parameters';
import { SortInput } from '../input/sort.input';
import { EntityCategoryType } from './entities.entity';

type GraphQLMutationQuerys = {
    entity: EntityCategoryType;
    filter: FilterInput;
    pagination?: PaginationParameters;
    sort?: SortInput;
};

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

    /** Organisationseinheit, der die Funktion zugeordnet ist. */
    @Prop({ required: true })
    orgUnit!: Types.ObjectId;

    /** Kennzeichnet, ob der Mandant ein Einzelbenutzer-Mandant ist. */
    @Prop({ required: true, default: false })
    isSingleUser!: boolean;

    @Prop({ required: true, default: false })
    isImpliciteFunction!: boolean;

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
    users?: string[];

    /** Die gespeicherte GraphQL-Abfrage */
    @Prop({
        type: Object, // explizite Angabe des Typs für `query`
        required: false,
    })
    query?: GraphQLMutationQuerys;
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

// versionKey deaktivieren
MANDATE_SCHEMA.set('versionKey', false);
