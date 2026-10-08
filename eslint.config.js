//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

const STORAGE_MSG =
  'Proibido usar Web Storage no Bora Vê (CLAUDE.md > Regras). Se for realmente necessário, pare e peça permissão ao usuário antes de prosseguir.'
const COOKIE_MSG =
  'Cookies de auth são HttpOnly e definidos só pelo servidor (CLAUDE.md > Regras). Não leia nem escreva document.cookie no cliente.'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    // Regras de segurança do Bora Vê (ver CLAUDE.md > Regras).
    // Mensagens escritas para o agente: dizem o que fazer em vez de só proibir.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: STORAGE_MSG },
        { name: 'sessionStorage', message: STORAGE_MSG },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'window', property: 'localStorage', message: STORAGE_MSG },
        { object: 'window', property: 'sessionStorage', message: STORAGE_MSG },
        { object: 'globalThis', property: 'localStorage', message: STORAGE_MSG },
        { object: 'globalThis', property: 'sessionStorage', message: STORAGE_MSG },
        { object: 'document', property: 'cookie', message: COOKIE_MSG },
      ],
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js', '.claude/**'],
  },
]
