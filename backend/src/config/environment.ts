import dotenv from 'dotenv';
import process from 'node:process';

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
 * Umgebungsvariable zur Konfiguration
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

// console.debug('NODE_ENV = %s', NODE_ENV);
