module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'object-curly-newline': 'off',
    'no-plusplus': 'off',
    'no-promise-executor-return': 'off',
    'func-style': 2,
    quotes: 'off',
    'consistent-return': 'off',
    'no-alert': 'off',
    camelcase: 'off',
    'no-unused-vars': [
      'error',
      { argsIgnorePattern: '_', destructuredArrayIgnorePattern: '^_' },
    ],
  },
};
