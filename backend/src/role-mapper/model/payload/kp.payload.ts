import type { Types } from 'mongoose';
import type { User } from '../entity/user.entity.js';

/**
 * Ergebnisstruktur für die Rückgabe von Benutzerdaten basierend auf einer Funktion.
 *
 * @property {string} functionName - Der Name der Funktion.
 * @property {User[]} users - Eine Liste der Benutzer, die der Funktion zugeordnet sind.
 * @property {boolean} isImpliciteFunction - Gibt an, ob es sich um eine implizite Funktion handelt.
 * @property {Types.ObjectId} [orgUnit] - Die ID der zugehörigen Organisationseinheit, falls vorhanden.
 */
export type GetUsersByFunctionResult = {
    functionName: string;
    users: User[];
    isImpliciteFunction: boolean;
    orgUnit?: Types.ObjectId;
};
