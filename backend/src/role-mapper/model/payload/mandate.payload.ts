/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/naming-convention */
import type { Types } from 'mongoose';
import type { User } from '../entity/user.entity.js';

/**
 * Nutzlast für die Rückgabe von Mandatsdaten.
 *
 * @property {User[]} users - Eine Liste der Benutzer, die mit dem Mandat verknüpft sind.
 * @property {string} functionName - Der Name der Funktion, die mit dem Mandat verknüpft ist.
 * @property {boolean} isImpliciteFunction - Gibt an, ob es sich um eine implizite Funktion handelt.
 * @property {Types.ObjectId} _id - Die eindeutige ID des Mandats.
 * @property {string} orgUnit - Die Organisations-Einheit, der das Mandat zugeordnet ist.
 */
export type MandatePayload = {
    users: User[];
    functionName: string;
    isImpliciteFunction: boolean;
    _id: Types.ObjectId;
    orgUnit: Types.ObjectId;
};
