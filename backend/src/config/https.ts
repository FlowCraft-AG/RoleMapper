import { type HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { VOLUMES_DIR } from './app.js';

const KEYS_DIR = path.resolve(VOLUMES_DIR, 'keys');
console.debug('tlsDir = %s', KEYS_DIR);

export const httpsOptions: HttpsOptions = {
    key: readFileSync(path.resolve(KEYS_DIR, 'key.pem'), 'utf8') || process.env.KEY, // eslint-disable-line security/detect-non-literal-fs-filename
    cert:
        readFileSync(path.resolve(KEYS_DIR, 'certificate.crt'), 'utf8') || process.env.CERTIFICATE, // eslint-disable-line security/detect-non-literal-fs-filename
};
