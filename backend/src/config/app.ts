import { load } from 'js-yaml';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const BASEDIR = existsSync('src') ? 'src' : 'dist';
export const RESOURCES_DIR = path.resolve(BASEDIR, 'config', 'resources');

const configFile = path.resolve(RESOURCES_DIR, 'app.yml');
export const config = load(
    readFileSync(configFile, 'utf8'), // eslint-disable-line security/detect-non-literal-fs-filename
) as Record<string, any>;
