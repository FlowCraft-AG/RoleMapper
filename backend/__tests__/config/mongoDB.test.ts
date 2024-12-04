import { describe, expect, test } from '@jest/globals';
import { ensureEnvironmentVariableDefined } from '../../src/config/mongo-database.js'; // Adjust the import path as necessary

describe('ensureEnvironmentVariableDefined', () => {
  test('should return the variable if it is defined', () => {
    const variable = 'defined_variable';
    const result = ensureEnvironmentVariableDefined(variable, 'TEST_VARIABLE');
    expect(result).toBe(variable);
  });

  test('should throw an error if the variable is undefined', () => {
    expect(() => ensureEnvironmentVariableDefined(undefined, 'UNDEFINED_VARIABLE')).toThrow(
      'Die Umgebungsvariable UNDEFINED_VARIABLE ist nicht definiert. Bitte prüfe deine .env-Datei.',
    );
  });
});
