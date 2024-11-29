module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', '.eslintrc.js', '.prettierrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true,
        allowExportNames: ['meta', 'links', 'headers', 'loader', 'action'],
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
      },
    ],
    '@typescript-eslint/indent': ['warn', 2, { SwitchCase: 1 }],
    'linebreak-style': ['warn', 'unix'],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    'prefer-const': 'warn',
    'no-empty': 'warn',
    'no-debugger': 'error',
    'no-console': ['error', { allow: ['warn', 'error', 'debug', 'info', 'table'] }],
    'no-implicit-globals': ['error'],
    'no-restricted-globals': ['error', 'name', 'requestIdleCallback'],
    'no-restricted-imports': ['error'],
    'no-restricted-modules': ['error'],
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'enum',
        format: ['UPPER_CASE', 'PascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['UPPER_CASE', 'PascalCase'],
      },
    ],
  },
  ignorePatterns: ['**/node_modules/', '.eslintrc.cjs', '/dist/*'],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
