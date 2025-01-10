/**
 * @file app.config.ts
 * @module AppConfig
 * @description Konfigurationsdatei zum Laden und Verarbeiten der Anwendungskonfiguration. 
 * Definiert Pfade und lädt YAML-basierte Einstellungen.
 */

import { load } from 'js-yaml';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * @constant {string} BASEDIR
 * @description Basisverzeichnis der Anwendung. 
 * Prüft, ob `src` existiert (für Entwicklungsumgebung) oder ob `dist` genutzt wird (für Produktion).
 */
export const BASEDIR = existsSync('src') ? 'src' : 'dist';

/**
 * @constant {string} RESOURCES_DIR
 * @description Pfad zum Ressourcenverzeichnis, in dem Konfigurationsdateien gespeichert sind.
 * Wird relativ zum Basisverzeichnis erstellt.
 */
export const RESOURCES_DIR = path.resolve(BASEDIR, 'config', 'resources');

/**
 * @constant {string} VOLUMES_DIR
 * @description Pfad zum Volumes-Verzeichnis, typischerweise außerhalb des Basisverzeichnisses. 
 * Wird für persistente Daten genutzt.
 */
export const VOLUMES_DIR = path.resolve(BASEDIR, '..', '..', '.volumes');

/**
 * @constant {string} configFile
 * @description Vollständiger Pfad zur Konfigurationsdatei `app.yml`, 
 * die sich im Ressourcenverzeichnis befindet.
 */
const configFile = path.resolve(RESOURCES_DIR, 'app.yml');

/**
 * @constant {Record<string, any>} config
 * @description Lädt die Konfigurationsdaten aus der YAML-Datei `app.yml` und 
 * gibt sie als ein JSON-Objekt zurück. Nutzt `js-yaml` für das Parsing.
 * 
 * @throws Fehler, wenn die Datei nicht gelesen oder geparst werden kann.
 */
export const config = load(
    readFileSync(configFile, 'utf8'), // eslint-disable-line security/detect-non-literal-fs-filename
) as Record<string, any>;
