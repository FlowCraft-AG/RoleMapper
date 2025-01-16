/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FilterInput } from '../input/filter.input.js';
import { PaginationParameters } from '../input/pagination-parameters.js';
import { SortInput } from '../input/sort.input.js';
import { EntityCategoryType } from './entities.entity.js';

/**
 * Typ für GraphQL-Mutationsabfragen.
 *
 * Dieser Typ definiert die Struktur für Abfrageparameter, die in GraphQL-Mutations
 * verwendet werden, einschließlich der Zielentität, Filterkriterien, Paginierungs-
 * und Sortieroptionen.
 */
export type GraphQLMutationQuerys = {
    /**
     * Die Zielentität der Abfrage.
     *
     * @type {EntityCategoryType}
     * @example
     * 'USERS', 'MANDATES', 'PROCESSES', 'ROLES', 'ORG_UNITS'
     */
    entity: EntityCategoryType;

    /**
     * Die Filterkriterien, die auf die Abfrage angewendet werden.
     *
     * @type {FilterInput}
     * @example
     * {
     *   field: 'name',
     *   operator: 'LIKE',
     *   value: 'John',
     *   AND: [
     *     { field: 'status', operator: 'EQ', value: 'active' }
     *   ]
     * }
     */
    filter: FilterInput;

    /**
     * Die Paginierungsparameter, um die Abfrageergebnisse zu begrenzen.
     *
     * @type {PaginationParameters}
     * @optional
     * @default undefined
     * @example
     * {
     *   limit: 10,
     *   offset: 20
     * }
     */
    pagination?: PaginationParameters;

    /**
     * Die Sortieroptionen, um die Reihenfolge der Ergebnisse zu steuern.
     *
     * @type {SortInput}
     * @optional
     * @default undefined
     * @example
     * {
     *   field: 'name',
     *   direction: 'ASC'
     * }
     */
    sort?: SortInput;
};

/**
 * Repräsentiert eine Funktion (Mandate) in der Datenbank.
 *
 * Funktionen beschreiben organisatorische Rollen oder Autoritäten, die Benutzern
 * und Organisationseinheiten zugeordnet sind.
 *
 * @schema Mandates
 */
@Schema({ collection: 'Functions' })
export class Mandates extends Document {
    /**
     * Der Name der Funktion (z. B. "Professor").
     *
     * @property {string} functionName - Muss eindeutig innerhalb der gleichen Organisationseinheit sein.
     */
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

    /**
     * Die Organisationseinheit, der die Funktion zugeordnet ist.
     *
     * @property {Types.ObjectId} orgUnit - Referenz auf die zugehörige Organisationseinheit.
     */
    @Prop({ required: true })
    orgUnit!: Types.ObjectId;

    /**
     * Gibt an, ob die Funktion nur für einen Benutzer gilt.
     *
     * @property {boolean} isSingleUser - Standardmäßig `false`.
     */
    @Prop({ required: true, default: false })
    isSingleUser!: boolean;

    /**
     * Gibt an, ob es sich um eine implizite Funktion handelt.
     *
     * @property {boolean} isImpliciteFunction - Standardmäßig `false`.
     */
    @Prop({ required: true, default: false })
    isImpliciteFunction!: boolean;

    /**
     * Die Benutzer, die dieser Funktion zugeordnet sind.
     *
     * @property {string[]} users - Eine Liste von Benutzer-IDs. Doppelte Werte sind nicht erlaubt.
     */
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

    /**
     * Die gespeicherte GraphQL-Abfrage.
     *
     * @property {GraphQLMutationQuerys} query - Optional gespeicherte Abfrageparameter.
     */
    @Prop({
        type: Object, // explizite Angabe des Typs für `query`
        required: false,
    })
    query?: GraphQLMutationQuerys;
}

// Typendefinition für Mandate
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
