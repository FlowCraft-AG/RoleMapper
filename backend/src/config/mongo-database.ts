import { environment } from './environment.js';

const { NODE_ENV, MONGODB_URI, MONGODB_DATABASE, TEST_MONGODB_URI, TEST_MONGODB_DATABASE } =
    environment;

let mongoDatabaseUri: string | undefined;
let mongoDatabaseName: string | undefined;


// Hilfsfunktion zur Überprüfung, ob eine Umgebungsvariable definiert ist
function ensureEnvironmentVariableDefined(
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

// Sicherstellen, dass die Variablen vom Typ string sind
const validatedMongoDatabaseUri: string = mongoDatabaseUri;
const validatedMongoDatabaseName: string = mongoDatabaseName;

export const database = {
    databaseName: validatedMongoDatabaseName,
    databaseUri: validatedMongoDatabaseUri,
} as const;
