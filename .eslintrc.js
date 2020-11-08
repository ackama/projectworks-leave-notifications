const config = {
  extends: ['ackama'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
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
