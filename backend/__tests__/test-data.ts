// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import * as dotenv from 'dotenv';
import { SUPPORTED_ENTITIES } from '../src/role-mapper/model/entity/entities.entity.js';

// Lade die Umgebungsvariablen aus der .env-Datei
dotenv.config();

// -----------------------------------------------------------------------------
// Dynamische Testdaten
// -----------------------------------------------------------------------------

// Verwende die Umgebungsvariablen aus der .env-Datei
export const ENDPOINTS = {
    USERS: `${SUPPORTED_ENTITIES[0]}`,
    FUNCTIONS: `${SUPPORTED_ENTITIES[1]}`,
    PROCESSES: `${SUPPORTED_ENTITIES[2]}`,
    ROLES: `${SUPPORTED_ENTITIES[3]}`,
    ORG_UNITS: `${SUPPORTED_ENTITIES[4]}`,
};

const USER_DATA = {
    USER_1: process.env.USER_1 ?? 'N/A',
    USER_2: process.env.USER_2 ?? 'N/A',
    LEITER_1: process.env.LEITER_1 ?? 'N/A',
    LEITER_2: process.env.LEITER_2 ?? 'N/A',
    ROLE_NAME_1: process.env.ROLE_NAME_1 ?? 'N/A',
    ROLE_NAME_2: process.env.ROLE_NAME_2 ?? 'N/A',
    ROLE_NAME_3: process.env.ROLE_NAME_3 ?? 'N/A',
    ROLE_NAME_4: process.env.ROLE_NAME_4 ?? 'N/A',
    PRUEFER: process.env.PRUEFER ?? 'N/A',
    FINANZ_ABTEILUNG_1: process.env.FINANZ_ABTEILUNG_1 ?? 'N/A',
    FINANZ_ABTEILUNG_2: process.env.FINANZ_ABTEILUNG_2 ?? 'N/A',
    FINANZ_ABTEILUNG_3: process.env.FINANZ_ABTEILUNG_3 ?? 'N/A',
    FINANZ_ABTEILUNG_4: process.env.FINANZ_ABTEILUNG_4 ?? 'N/A',
    FUNCTION_1: process.env.FUNCTION_1 ?? 'N/A',
    FUNCTION_2: process.env.FUNCTION_2 ?? 'N/A',
    FUNCTION_3: process.env.FUNCTION_3 ?? 'N/A',
    FUNCTION_4: process.env.FUNCTION_4 ?? 'N/A',
};

export const INVALID_TEST_DATA = {
    USER: process.env.INVALID_USER,
    PROCESS: process.env.INVALID_PROCESS,
};

export const EXPECTED_RESULTS = {
    USERS_COUNT: Number.parseInt(process.env.USERS_COUNT ?? '0', 10),
    FUNCTIONS_COUNT: Number.parseInt(process.env.FUNCTIONS_COUNT ?? '0', 10),
    PROCESSES_COUNT: Number.parseInt(process.env.PROCESSES_COUNT ?? '0', 10),
    ROLES_COUNT: Number.parseInt(process.env.ROLES_COUNT ?? '0', 10),
    ROLE_COUNT: Number.parseInt(process.env.ROLE_COUNT ?? '0', 10),
    ORG_UNITS_COUNT: Number.parseInt(process.env.ORG_UNITS_COUNT ?? '0', 10),
};

// -----------------------------------------------------------------------------
// Zusätzliche Testdaten für bestimmte Benutzer
// -----------------------------------------------------------------------------

// Beispiel-Testdaten, die aus der .env-Datei geladen werden
export const TEST_EMPLOYEE_1 = {
    userId: USER_DATA.USER_1,
    functionName: USER_DATA.FUNCTION_1,
    leiter: USER_DATA.LEITER_1,
    functionNameLeiter: USER_DATA.FUNCTION_2,
    rechnungsPrüfer: USER_DATA.PRUEFER,
    finanzAbteilung: [
        USER_DATA.FINANZ_ABTEILUNG_1,
        USER_DATA.FINANZ_ABTEILUNG_2,
        USER_DATA.FINANZ_ABTEILUNG_3,
        USER_DATA.FINANZ_ABTEILUNG_4,
    ],
};

export const ROLES = {
    ROLE_1: USER_DATA.ROLE_NAME_1 ?? 'N/A',
    ROLE_2: USER_DATA.ROLE_NAME_2 ?? 'N/A',
    ROLE_3: USER_DATA.ROLE_NAME_3 ?? 'N/A',
    ROLE_4: USER_DATA.ROLE_NAME_4 ?? 'N/A',
};

export const PROCESS = {
    PROCESS_2: process.env.PROCESS_2 ?? 'N/A',
    PROCESS_1: process.env.PROCESS_1 ?? 'N/A',
};

export const TEST_EMPLOYEE_2 = {
    userId: USER_DATA.USER_2,
    functionName: USER_DATA.FUNCTION_3,
    leiter: USER_DATA.LEITER_2,
    functionNameLeiter: USER_DATA.FUNCTION_4,
};