import dotenv from 'dotenv';
import process from 'node:process';

// Laden der Umgebungsvariablen aus einer .env-Datei
dotenv.config();

const {
    NODE_ENV,
    KEYCLOAK_CLIENT_SECRET,
    LOG_LEVEL,
    START_DB_SERVER,
    MONGODB_URI,
    MONGODB_DATABASE,
    TEST_MONGODB_URI,
    TEST_MONGODB_DATABASE,
} = process.env;

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Konstante, die die Umgebungsvariablen der Anwendung bereitstellt.
 *
 * @property {string | undefined} NODE_ENV - Die Umgebung, in der die Anwendung läuft (z. B. `development`, `production`, `test`).
 * @property {string | undefined} KEYCLOAK_CLIENT_SECRET - Das Geheimnis für die Keycloak-Client-Authentifizierung.
 * @property {string | undefined} LOG_LEVEL - Das Log-Level für die Protokollierung (z. B. `info`, `debug`, `error`).
 * @property {string | undefined} START_DB_SERVER - Gibt an, ob der Datenbankserver beim Start gestartet werden soll.
 * @property {string | undefined} MONGODB_URI - Die Verbindungs-URI für die MongoDB-Datenbank.
 * @property {string | undefined} MONGODB_DATABASE - Der Name der MongoDB-Datenbank.
 * @property {string | undefined} TEST_MONGODB_URI - Die Verbindungs-URI für die MongoDB-Datenbank in Testumgebungen.
 * @property {string | undefined} TEST_MONGODB_DATABASE - Der Name der MongoDB-Datenbank in Testumgebungen.
 */
export const environment = {
    NODE_ENV,
    KEYCLOAK_CLIENT_SECRET,
    LOG_LEVEL,
    START_DB_SERVER,
    MONGODB_URI,
    MONGODB_DATABASE,
    TEST_MONGODB_URI,
    TEST_MONGODB_DATABASE,
} as const;

/* eslint-enable @typescript-eslint/naming-convention */

// Debug-Ausgabe für Entwicklungszwecke
// console.debug('NODE_ENV = %s', NODE_ENV);
