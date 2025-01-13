/**
 * @file Logger-Utility - Funktion zum Erstellen von Logger-Instanzen mit Kontext.
 * @module LoggerUtility
 * @description Diese Datei enthält eine Funktion, die einen Logger mit einem angegebenen Kontext und optional einem Typ erstellt.
 */

import type pino from 'pino';
import { parentLogger } from '../config/logger.js';

/**
 * @description Gibt eine Pino-Logger-Instanz zurück, die mit einem gegebenen Kontext und optionalem Typ versehen ist.
 * Der Logger wird von einem übergeordneten Logger abgeleitet und bietet spezifische Bindings für den Kontext.
 * @param context - Der Kontext, der dem Logger hinzugefügt wird (z.B. der Name einer Klasse).
 * @param kind - Der Typ des Loggers (standardmäßig 'class', kann aber angepasst werden).
 * @returns Eine Pino-Logger-Instanz mit den zugehörigen Bindings.
 */
export const getLogger: (context: string, kind?: string) => pino.Logger<string> = (
    context: string,
    kind = 'class',
) => {
    const bindings: Record<string, string> = {};
    // eslint-disable-next-line security/detect-object-injection
    bindings[kind] = context;
    return parentLogger.child(bindings);
};

