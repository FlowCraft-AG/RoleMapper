import type { Types } from 'mongoose';
import { type ProcessRoleInput } from './create.input.js';
import { type QueryStageInput } from './query-stage.input.js';

/**
 * Eingabetyp für die Aktualisierung von Benutzerdaten.
 */
export type UpdateUserInput = {
    /**
     * Die ID des Benutzers.
     *
     * @type {string}
     */
    userId: string;

    /**
     * Der Typ des Benutzers (z. B. 'Student' oder 'Mitarbeiter').
     *
     * @type {string | undefined}
     */
    userType?: string;

    /**
     * Die Rolle des Benutzers.
     *
     * @type {string | undefined}
     */
    userRole?: string;

    /**
     * Die zugeordnete Organisationseinheit des Benutzers.
     *
     * @type {string | undefined}
     */
    orgUnit?: string;

    /**
     * Gibt an, ob der Benutzer aktiv ist.
     *
     * @type {boolean | undefined}
     */
    active?: boolean;

    /**
     * Gültigkeitsbeginn des Benutzers.
     *
     * @type {string | undefined}
     */
    validFrom?: string;

    /**
     * Gültigkeitsende des Benutzers.
     *
     * @type {string | undefined}
     */
    validUntil?: string;

    /**
     * Spezifische Daten für Studenten.
     *
     * @type {UpdateStudentInput | undefined}
     */
    student?: UpdateStudentInput;

    /**
     * Spezifische Daten für Mitarbeiter.
     *
     * @type {UpdateEmployeeInput | undefined}
     */
    employee?: UpdateEmployeeInput;
};

/**
 * Eingabetyp für die Aktualisierung von Studentendaten.
 */
export type UpdateStudentInput = {
    /**
     * Der Studiengang des Studenten.
     *
     * @type {string | undefined}
     */
    courseOfStudy?: string;

    /**
     * Das Studienlevel des Studenten.
     *
     * @type {string | undefined}
     */
    level?: string;

    /**
     * Die Prüfungsordnung des Studenten.
     *
     * @type {string | undefined}
     */
    examRegulation?: string;
};

/**
 * Eingabetyp für die Aktualisierung von Mitarbeiterdaten.
 */
export type UpdateEmployeeInput = {
    /**
     * Die Kostenstelle des Mitarbeiters.
     *
     * @type {string | undefined}
     */
    costCenter?: string;

    /**
     * Die Abteilung des Mitarbeiters.
     *
     * @type {string | undefined}
     */
    department?: string;
};

/**
 * Eingabetyp für die Aktualisierung von Funktionen.
 */
export type UpdateFunctionInput = {
    /**
     * Der Name der Funktion.
     *
     * @type {string}
     */
    functionName: string;

    /**
     * Die Organisationseinheit der Funktion.
     *
     * @type {Types.ObjectId | string | undefined}
     */
    orgUnit?: Types.ObjectId | string;

    /**
     * Der Typ der Funktion.
     *
     * @type {string | undefined}
     */
    type?: string;

    /**
     * Die Benutzer, die der Funktion zugeordnet sind.
     *
     * @type {string[] | undefined}
     */
    users?: string[];
};

/**
 * Eingabetyp für die Aktualisierung von Prozessen.
 */
export type UpdateProcessInput = {
    parentId: Types.ObjectId;

    /**
     * Der Name des Prozesses.
     *
     * @type {string | undefined}
     */
    name?: string;

    /**
     * Die Rollen, die dem Prozess zugeordnet sind.
     *
     * @type {ProcessRoleInput[] | undefined}
     */
    roles?: ProcessRoleInput[];
};

/**
 * Eingabetyp für die Aktualisierung von Organisationseinheiten.
 */
export type UpdateOrgUnitInput = {
    /**
     * Die ID der Organisationseinheit.
     *
     * @type {string}
     */
    orgUnitId: string;

    /**
     * Der Name der Organisationseinheit.
     *
     * @type {string | undefined}
     */
    name?: string;

    /**
     * Die ID der übergeordneten Organisationseinheit.
     *
     * @type {Types.ObjectId | string | undefined}
     */
    parentId?: Types.ObjectId | string;

    /**
     * Der Vorgesetzte der Organisationseinheit.
     *
     * @type {Types.ObjectId | string | undefined}
     */
    supervisor?: Types.ObjectId | string;
};

/**
 * Eingabetyp für die Aktualisierung von Rollen.
 */
export type UpdateRoleInput = {
    /**
     * Die ID der Rolle.
     *
     * @type {string}
     */
    roleId: string;

    /**
     * Der Name der Rolle.
     *
     * @type {string | undefined}
     */
    name?: string;

    /**
     * Die gespeicherte Abfrage für die Rolle.
     *
     * @type {QueryStageInput[] | undefined}
     */
    query?: QueryStageInput[];
};

/**
 * Typ für allgemeine Aktualisierungsdaten.
 *
 * Dieser Typ fasst die spezifischen Aktualisierungsdaten für Benutzer,
 * Funktionen, Prozesse, Organisationseinheiten und Rollen zusammen.
 */
export type UpdateDataInput =
    | UpdateUserInput
    | UpdateFunctionInput
    | UpdateProcessInput
    | UpdateOrgUnitInput
    | UpdateRoleInput;
