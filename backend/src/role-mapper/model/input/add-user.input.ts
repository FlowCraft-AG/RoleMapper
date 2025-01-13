/**
 * Eingabetyp für Operationen, die Benutzer einer Funktion zuordnen oder entfernen.
 *
 * Dieser Typ definiert die Eingabedaten, die für das Hinzufügen oder Entfernen
 * eines Benutzers zu/von einer Funktion erforderlich sind.
 */
export type UserFunctionInput = {
    /**
     * Die ID der Funktion, auf die sich die Operation bezieht.
     *
     * @type {string}
     * @example "64b1f768d9a8e900001b1b2f"
     */
    functionId: string;

    /**
     * Die ID des Benutzers, der hinzugefügt oder entfernt werden soll.
     *
     * @type {string}
     * @example "12345"
     */
    userId: string;
};
