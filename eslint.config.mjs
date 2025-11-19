import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
  // Ignore build outputs and dependencies
  {
    ignores: ['dist/**', 'node_modules/**', 'out/**', '.vite/**', '*.config.js', '*.config.ts'],
  },

  // Base ESLint and TypeScript recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React configuration for renderer files
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/prop-types': 'off', // Using TypeScript for prop validation
    },
  },

  // General rules for all TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.main.json', './tsconfig.renderer.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // General code quality rules
      'no-console': 'off', // Allow console in Electron apps
      'prefer-const': 'warn',
      'no-var': 'error',
      'func-names': 'off', // Allow arrow callbacks and inline handlers without naming noise
    },
  }
);
