import { Config } from '@jest/types';
import 'ts-jest';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setupExpectEachTestHasAssertions.ts'],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  // I like this because I can find (somewhat) the compiled typescript output
  cacheDirectory: '.tmp',

  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  transform: {
    '\\.tsx?': [
      'ts-jest',
      {
        // disable type checking when running tests, speeding them up and making
        // the development experience nicer by not blocking tests on types
        isolatedModules: true
      }
    ]
  }
};

export default config;
