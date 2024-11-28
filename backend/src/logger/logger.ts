import type pino from 'pino';
import { parentLogger } from '../config/logger.js';

export const getLogger: (
    context: string,
    kind?: string,
) => pino.Logger<string> = (context: string, kind = 'class') => {
    const bindings: Record<string, string> = {};
    // eslint-disable-next-line security/detect-object-injection
    bindings[kind] = context;
    return parentLogger.child(bindings);
};
