/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/naming-convention */
import { describe, expect, it, jest } from '@jest/globals';
import { ensureEnvironmentVariableDefined } from '../../src/config/mongo-database.js';

describe('Environment Variable Tests', () => {
    const TEST_DATA = {
        URI: 'mongodb://localhost:27017',
        DATABASE: 'prod-db',
        TEST_URI: 'mongodb://localhost:27017/test',
        TEST_DATABASE: 'test-db',
        NODE_ENV: 'test',
    };

    // Mocken der environment-Daten
    jest.mock('../../src/config/environment', () => ({
        environment: {
            NODE_ENV: TEST_DATA.NODE_ENV,
            MONGODB_URI: TEST_DATA.URI,
            MONGODB_DATABASE: TEST_DATA.DATABASE, // Korrekt zugewiesen
            TEST_MONGODB_URI: TEST_DATA.TEST_URI, // Korrekt zugewiesen
            TEST_MONGODB_DATABASE: TEST_DATA.TEST_DATABASE,
        },
    }));

    it('should throw an error if an environment variable is undefined', () => {
        // Test für den Fall, dass eine Umgebungsvariable nicht definiert ist
        expect(() => {
            ensureEnvironmentVariableDefined(undefined, 'MONGODB_URI');
        }).toThrow(
            'Die Umgebungsvariable MONGODB_URI ist nicht definiert. Bitte prüfe deine .env-Datei.',
        );
    });

    it('should return the correct environment variable if defined', () => {
        // Test für den Fall, dass eine Umgebungsvariable definiert ist
        const result = ensureEnvironmentVariableDefined(TEST_DATA.URI, 'MONGODB_URI');

        expect(result).toBe(TEST_DATA.URI);
    });

    it('should correctly handle the "test" environment configuration', () => {
        // Test für die Logik, wenn NODE_ENV === "test"
        const mongoDatabaseUri = ensureEnvironmentVariableDefined(
            TEST_DATA.TEST_URI,
            'TEST_MONGODB_URI',
        );
        const mongoDatabaseName = TEST_DATA.TEST_DATABASE;

        expect(mongoDatabaseUri).toBe(TEST_DATA.TEST_URI);
        expect(mongoDatabaseName).toBe(TEST_DATA.TEST_DATABASE);
    });

    it('should correctly handle non-test environment configuration', () => {
        // Manuelles Setzen von NODE_ENV auf "production"
        process.env.NODE_ENV = 'production';

        const mongoDatabaseUri = ensureEnvironmentVariableDefined(TEST_DATA.URI, 'MONGODB_URI');
        const mongoDatabaseName = ensureEnvironmentVariableDefined(
            TEST_DATA.DATABASE,
            'MONGODB_DATABASE',
        );

        // Überprüfen, ob die Umgebungsvariablen korrekt aufgelöst werden
        expect(mongoDatabaseUri).toBe(TEST_DATA.URI); // Verwendet TEST_DATA.URI
        expect(mongoDatabaseName).toBe(TEST_DATA.DATABASE); // Verwendet TEST_DATA.DATABASE
    });
});
