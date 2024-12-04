const jestConfig = {
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
    testRegex: String.raw`__tests__/.*/.*\.test\.m?ts$`,
    roots: ['<rootDir>/__tests__', '<rootDir>/src'],
    collectCoverageFrom: ['<rootDir>/src/**/*.*ts'],
    testEnvironment: 'node',

    bail: true,
    coveragePathIgnorePatterns: [
        String.raw`<rootDir>/src/main\.m?ts$`,
        String.raw`.*\.module\.m?ts$`,
        '<rootDir>/src/health/',
    ],
    coverageReporters: ['lcov', 'text-summary', 'html'],
    errorOnDeprecated: true,
    testTimeout: 60_000,
    verbose: true,
};

export default jestConfig;