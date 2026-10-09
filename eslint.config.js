//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

const STORAGE_MSG =
  'Proibido usar Web Storage no Bora Vê (CLAUDE.md > Regras). Se for realmente necessário, pare e peça permissão ao usuário antes de prosseguir.'
const COLOR_MSG =
  'Cor solta no className. Use os tokens de src/styles.css (ex.: bg-night, text-tungsten). Se faltar uma cor, crie o token lá (ver DESIGN.md).'
const DOMAIN_MSG =
  'src/domain/ é regra de negócio pura: só importa do próprio domínio (./ ou #/domain/). Nada de Prisma, banco, React, rotas ou HTTP (CLAUDE.md > Estrutura). Quem chama o domínio (rota, server function) é que busca os dados e passa por parâmetro.'
const HASH_MSG =
  'Nada de `#` na URL (CLAUDE.md > Regras). Para ir a uma seção da mesma página, use um botão com `scrollToSection(id)` (src/lib/scroll-to-section.ts); para outra página, crie uma rota (ex.: /destaques).'
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
        {
          object: 'globalThis',
          property: 'localStorage',
          message: STORAGE_MSG,
        },
        {
          object: 'globalThis',
          property: 'sessionStorage',
          message: STORAGE_MSG,
        },
        { object: 'document', property: 'cookie', message: COOKIE_MSG },
      ],
      // Design system: nada de cor arbitrária do Tailwind (text-[#ff0000], bg-[rgb(...)]).
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\[(#|rgb|hsl|oklch)/]',
          message: COLOR_MSG,
        },
        {
          selector: 'TemplateElement[value.raw=/\\[(#|rgb|hsl|oklch)/]',
          message: COLOR_MSG,
        },
        // Rotas sem `#`: href="#secao", href="/#secao" e a prop `hash` do Link.
        {
          selector: 'JSXAttribute[name.name="href"][value.value=/^\\/?#/]',
          message: HASH_MSG,
        },
        {
          selector: 'JSXAttribute[name.name="hash"]',
          message: HASH_MSG,
        },
      ],
    },
  },
  {
    // Arquitetura: o domínio não depende de nada de fora dele. É isso que deixa as
    // regras de negócio testáveis sem banco e sem navegador.
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Liberado: ./x, ../x (dentro do domínio), #/domain/x e vitest nos testes.
              regex: '^(?!\\./|\\.\\./(?!\\.\\.)|#/domain/|vitest$)',
              message: DOMAIN_MSG,
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      '.claude/**',
      // Saídas geradas: build e relatórios do Playwright.
      '.output/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
]
