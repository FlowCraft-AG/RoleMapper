import { config } from './app.js';
import { logLevel } from './logger.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const prettyPrint: string | undefined = config.health?.prettyPrint;

export const healthConfig = {
    prettyPrint: prettyPrint !== undefined && prettyPrint.toLowerCase() === 'true',
} as const;

if (logLevel === 'debug') {
    console.debug('healthConfig: %o', healthConfig);
}
