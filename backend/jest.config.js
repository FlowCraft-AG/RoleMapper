// import { type Config } from '@jest/types';

// const jestConfig: Config.InitialOptions = {
const jestConfig = {
    // globalSetup: '<rootDir>/dist/__tests__/global-setup.js',
    // globalTeardown: '<rootDir>/dist/__tests__/global-teardown.js',
    // setupFilesAfterEnv: ['<rootDir>/dist/__tests__/setup-jest.js'],

    // Verzeichnis in node_modules mit einer Datei jest-preset.js
    preset: 'ts-jest/presets/default-esm',

    extensionsToTreatAsEsm: ['.ts', '.mts', '.json'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.m?js$': '$1', // eslint-disable-line @typescript-eslint/naming-convention
    },

    transform: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '\\.test\\.m?ts$': [
            'ts-jest',
            {
                useESM: true,
                isolatedModules: false,
            },
        ],
    },

    //  testRegex: String.raw`__tests__\.*\\.*test\.m?ts$`,
    testRegex: String.raw`__tests__/.*/.*\.test\.m?ts$`,
    roots: ['<rootDir>/__tests__', '<rootDir>/src'],
    // roots: [
    //     '<rootDir>/.github/actions-runner/_work/bankkonto-verwalter-nestjs/bankkonto-verwalter-nestjs/__tests__',
    // ],
    collectCoverageFrom: ['<rootDir>/src/**/*.*ts'],
    // coverageDirectory: 'coverage',
    testEnvironment: 'node',

    bail: true,
    coveragePathIgnorePatterns: [
        String.raw`<rootDir>/src/main\.m?ts$`,
        String.raw`.*\.module\.m?ts$`,
        '<rootDir>/src/health/',
    ],
    // lcov fuer SonarQube
    coverageReporters: ['lcov', 'text-summary', 'html'],
    errorOnDeprecated: true,
    // Hoher Timeout-Wert, insbesondere fuer den ersten Mutation-Test
    testTimeout: 60_000,
    verbose: true,
    // showSeed: true,
};

export default jestConfig;
