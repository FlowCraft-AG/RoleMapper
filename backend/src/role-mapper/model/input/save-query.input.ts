import type { Types } from 'mongoose';
import type { DataInput } from './data.input.js';

/**
 * Eingabetyp für das Speichern einer Abfrage.
 */
export type SaveQueryInput = {
    /**
     * Der Name der Funktion, für die die Abfrage gespeichert werden soll.
     *
     * @type {string}
     * @example "Manager"
     */
    functionName: string;

    /**
     * Die ID der Organisationseinheit, die mit der Abfrage verbunden ist.
     *
     * @type {Types.ObjectId}
     * @example new Types.ObjectId('64b1f768d9a8e900001b1b2f')
     */
    orgUnitId: Types.ObjectId;

    /**
     * Die Abfrageparameter, einschließlich Entität, Filter- und Sortierkriterien.
     *
     * @type {DataInput}
     * @example
     * {
     *   entity: 'USERS',
     *   filter: { field: 'status', operator: 'EQ', value: 'active' },
     *   sort: { field: 'name', direction: 'ASC' },
     * }
     */
    input: DataInput;
};
