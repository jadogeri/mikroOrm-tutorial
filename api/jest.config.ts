import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm', // Use ESM preset
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    // Transform TypeScript files with ts-jest in ESM mode
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    // Handle .js extensions in imports (required for true ESM)
    '^(\\.\\.?\\/.+)\\.js$': '$1',
  },
};

export default config;
