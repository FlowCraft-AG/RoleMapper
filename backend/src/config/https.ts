import { type HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { VOLUMES_DIR } from './app.js';

const KEYS_DIR = path.resolve(VOLUMES_DIR, 'keys');
console.debug('tlsDir = %s', KEYS_DIR);

export const httpsOptions: HttpsOptions = {
    key: readFileSync(path.resolve(KEYS_DIR, 'key.pem')), // eslint-disable-line security/detect-non-literal-fs-filename
    cert: readFileSync(path.resolve(KEYS_DIR, 'certificate.crt')), // eslint-disable-line security/detect-non-literal-fs-filename
};
