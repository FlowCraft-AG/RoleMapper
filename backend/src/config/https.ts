/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-non-literal-fs-filename */
import { type HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { VOLUMES_DIR } from './app.js';

const KEYS_DIR = path.resolve(VOLUMES_DIR, 'keys');
console.debug('tlsDir = %s', KEYS_DIR);

export const httpsOptions: HttpsOptions = {
    key: readFileSync(path.resolve(KEYS_DIR, 'key.pem')),
    cert: readFileSync(path.resolve(KEYS_DIR, 'certificate.crt')),
};

// export const httpsOptions = {
//     key: existsSync(path.resolve(KEYS_DIR, 'key.pem'))
//         ? readFileSync(path.resolve(KEYS_DIR, 'key.pem'))
//         : process.env.KEY,
//     cert: existsSync(path.resolve(KEYS_DIR, 'certificate.crt'))
//         ? readFileSync(path.resolve(KEYS_DIR, 'certificate.crt'))
//         : process.env.CERTIFICATE,
// };
