import { hostname } from 'node:os';
import { RESOURCES_DIR, config } from './app.js';
import { environment } from './environment.js';
import { httpsOptions } from './https.js';

const { NODE_ENV } = environment;

const computername = hostname();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const port = (config.node?.port as number | undefined) ?? 3000; // eslint-disable-line @typescript-eslint/no-magic-numbers

export const nodeConfig = {
    host: computername,
    port,
    resourcesDir: RESOURCES_DIR,
    httpsOptions,
    nodeEnv: NODE_ENV as 'development' | 'PRODUCTION' | 'production' | 'test' | undefined,
} as const;
