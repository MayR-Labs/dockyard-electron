const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        React: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: [
      'dist',
      'out',
      'node_modules',
      '.eslintrc.cjs',
      'eslint.config.js',
      '**/__tests__/**',
      '**/__mocks__/**',
      '**/*.test.js',
      '**/*.spec.js',
    ],
  },
  eslintConfigPrettier,
];
