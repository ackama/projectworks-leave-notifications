const config = {
  extends: ['ackama'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  env: {
    node: true
  },
  overrides: [
    {
      files: ['spec/**'],
      extends: ['ackama/jest'],
      rules: { 'jest/prefer-expect-assertions': 'off' }
    }
  ]
};

module.exports = config;
