import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

const { NODE_ENV, CLIENT_SECRET, LOG_LEVEL, START_DB_SERVER } = process.env;

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Umgebungsvariable zur Konfiguration
 */
export const env = {
    NODE_ENV,
    CLIENT_SECRET,
    LOG_LEVEL,
    START_DB_SERVER,
} as const;
/* eslint-enable @typescript-eslint/naming-convention */

console.debug('NODE_ENV = %s', NODE_ENV);
