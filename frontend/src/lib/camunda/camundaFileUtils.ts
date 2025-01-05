'use server';

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export type FileType = 'bpmn' | 'form' | 'dmn';

export const getFiles = async (type: FileType) => {
  const basePath = join(process.cwd(), '..', '.extras', 'camunda');
  const directory = join(basePath, type);

  if (!existsSync(directory)) {
    console.warn(`Das Verzeichnis ${directory} existiert nicht.`);
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

export const getCamundaFiles = async () => {
  const bpmnFiles = await getFiles('bpmn');
  const formFiles = await getFiles('form');
  const dmnFiles = await getFiles('dmn');

  return { bpmnFiles, formFiles, dmnFiles };
};
