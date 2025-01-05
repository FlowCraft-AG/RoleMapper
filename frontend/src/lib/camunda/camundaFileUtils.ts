/**
 * @file camunda-file-reader.ts
 * @description Dieses Modul stellt Funktionen zum Lesen von Camunda-Dateien aus den Verzeichnissen `.extras/camunda` bereit. Unterstützt werden BPMN-, Form- und DMN-Dateien.
 *
 * @module camunda-file-reader
 */

'use server';

import { getLogger } from '../../utils/logger';

const logger = getLogger('camunda-file-reader');

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export type FileType = 'bpmn' | 'form' | 'dmn';

/**
 * Ruft die Dateien eines bestimmten Typs aus dem Camunda-Verzeichnis ab.
 *
 * @param {FileType} type - Der Dateityp ('bpmn', 'form', 'dmn').
 * @returns {Promise<{ name: string; content: string }[]>} Eine Liste der Dateien mit Namen und Inhalt.
 */
export const getFiles = async (type: FileType) => {
  const basePath = join(process.cwd(), '..', '.extras', 'camunda');
  logger.debug('basePath für Camunda-Dateien:', basePath);
  const directory = join(basePath, type);
  logger.debug('Verzeichnis für %s Dateien:', type, directory);

  if (!existsSync(directory)) {
    logger.warn('Das Verzeichnis %s existiert nicht.', directory);
    return [];
  }

  const files = readdirSync(directory).filter((file) =>
    type === 'bpmn'
      ? file.endsWith('.bpmn')
      : type === 'form'
        ? file.endsWith('.form')
        : file.endsWith('.dmn'),
  );

  return files.map((file) => ({
    name: file,
    content: readFileSync(join(directory, file), 'utf-8'),
  }));
};

/**
 * Ruft alle Camunda-Dateien (BPMN, Form, DMN) aus den entsprechenden Verzeichnissen ab.
 *
 * @returns {Promise<{ bpmnFiles: { name: string; content: string }[]; formFiles: { name: string; content: string }[]; dmnFiles: { name: string; content: string }[] }>}
 * Eine Objektstruktur mit BPMN-, Form- und DMN-Dateien.
 */
export const getCamundaFiles = async () => {
  const bpmnFiles = await getFiles('bpmn');
  const formFiles = await getFiles('form');
  const dmnFiles = await getFiles('dmn');

  return { bpmnFiles, formFiles, dmnFiles };
};
