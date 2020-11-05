const config = {
  testEnvironment: 'node',

  // I like this because I can find (somewhat) the compiled typescript output
  cacheDirectory: '.tmp',

  setupFilesAfterEnv: ['./spec/setupExpectEachTestHasAssertions.js'],

  // Automatically clear mock calls and instances before every test. Equivalent
  // to calling jest.clearAllMocks() before each test. This does not remove any
  // mock implementation that may have been provided.
  clearMocks: true,

  // Automatically restore mock state before every test. Equivalent to calling
  // jest.restoreAllMocks() before each test. This will lead to any mocks having
  // their fake implementations removed and restores their initial
  // implementation.
  // Beware that jest.restoreAllMocks() only works when the mock was created
  // with jest.spyOn; other mocks will require you to manually restore them.
  restoreMocks: true,

  // Automatically reset mock state before every test. Equivalent to calling
  // jest.resetAllMocks() before each test. This will lead to any mocks having
  // their fake implementations removed but does not restore their initial
  // implementation.
  resetMocks: true
};

module.exports = config;
