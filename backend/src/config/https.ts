import { type HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { RESOURCES_DIR } from './app.js';

const tlsDir = path.resolve(RESOURCES_DIR, 'tls');
console.debug('tlsDir = %s', tlsDir);

export const httpsOptions: HttpsOptions = {
    key: readFileSync(path.resolve(tlsDir, 'key.pem')), // eslint-disable-line security/detect-non-literal-fs-filename
    cert: readFileSync(path.resolve(tlsDir, 'certificate.crt')), // eslint-disable-line security/detect-non-literal-fs-filename
};
