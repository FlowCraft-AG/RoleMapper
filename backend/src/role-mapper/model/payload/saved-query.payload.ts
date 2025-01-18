import type { Mandates } from '../entity/mandates.entity.js';

/**
 * Nutzlast für die Antwort der gespeicherten Abfrage.
 */
export type SavedQueryPayload = {
    /**
     * Gibt an, ob die Speicherung der Abfrage erfolgreich war.
     *
     * @type {boolean}
     * @example true
     */
    success: boolean;

    /**
     * Eine Nachricht, die den Status der Speicherung beschreibt.
     *
     * @type {string}
     * @example "Save operation successful."
     */
    message: string;

    /**
     * Das Ergebnis der gespeicherten Abfrage.
     *
     * @type {Mandates}
     * @example
     * {
     *   functionName: 'Manager',
     *   orgUnit: '64b1f768d9a8e900001b1b2f',
     *   users: ['12345', '67890'],
     * }
     */
    result: Mandates;
};
