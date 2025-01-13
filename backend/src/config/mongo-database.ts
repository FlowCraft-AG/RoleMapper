/**
 * @file
 * Modul zur Konfiguration der MongoDB-Verbindung.
 *
 * @module DatabaseConfig
 * @description
 * Dieses Modul definiert die Konfigurationsparameter für die Verbindung mit einer MongoDB-Datenbank, 
 * basierend auf den Umgebungsvariablen. Es unterstützt sowohl Produktions- als auch Testumgebungen 
 * und validiert die erforderlichen Variablen.
 */

import { environment } from './environment.js';

// Extrahieren relevanter Umgebungsvariablen
const { NODE_ENV, MONGODB_URI, MONGODB_DATABASE, TEST_MONGODB_URI, TEST_MONGODB_DATABASE } =
    environment;

let mongoDatabaseUri: string | undefined;
let mongoDatabaseName: string | undefined;

/**
 * Hilfsfunktion zur Überprüfung, ob eine Umgebungsvariable definiert ist.
 *
 * @param {string | undefined} variable - Der Wert der Umgebungsvariable.
 * @param {string} variableName - Der Name der Umgebungsvariable.
 * @returns {string} Der gültige Wert der Umgebungsvariable.
 * @throws {Error} Wenn die Umgebungsvariable nicht definiert ist.
 *
 * @example
 * const uri = ensureEnvironmentVariableDefined(process.env.MONGODB_URI, 'MONGODB_URI');
 */
export function ensureEnvironmentVariableDefined(
    variable: string | undefined,
    variableName: string,
): string {
    if (variable === undefined) {
        throw new Error(
            `Die Umgebungsvariable ${variableName} ist nicht definiert. Bitte prüfe deine .env-Datei.`,
        );
    }
    return variable;
}

// Umgebungsabhängige Konfiguration
if (NODE_ENV === 'test') {
    // Für die Testumgebung
    mongoDatabaseUri = ensureEnvironmentVariableDefined(TEST_MONGODB_URI, 'TEST_MONGODB_URI');
    mongoDatabaseName = TEST_MONGODB_DATABASE;
    if (mongoDatabaseName === undefined) {
        throw new Error(
            'Die Umgebungsvariable TEST_MONGODB_DATABASE ist nicht definiert. Bitte prüfe deine .env-Datei.',
        );
    }
} else {
    // Für andere Umgebungen (z.B. Produktion)
    mongoDatabaseUri = ensureEnvironmentVariableDefined(MONGODB_URI, 'MONGODB_URI');
    mongoDatabaseName = ensureEnvironmentVariableDefined(MONGODB_DATABASE, 'MONGODB_DATABASE');
}

// Sicherstellen, dass die Variablen validiert sind
const validatedMongoDatabaseUri: string = mongoDatabaseUri;
const validatedMongoDatabaseName: string = mongoDatabaseName;

/**
 * @constant
 * @type {object}
 * @description
 * Die Konfiguration für die MongoDB-Datenbankverbindung.
 *
 * @property {string} databaseName - Der Name der Datenbank.
 * @property {string} databaseUri - Die Verbindungs-URI zur MongoDB-Datenbank.
 *
 * @example
 * console.log(database.databaseName); // Ausgabe des Datenbanknamens
 * console.log(database.databaseUri);  // Ausgabe der Verbindungs-URI
 */
export const database = {
    databaseName: validatedMongoDatabaseName,
    databaseUri: validatedMongoDatabaseUri,
} as const;

