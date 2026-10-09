import { describe, expect, it } from 'vitest'

import { check } from './guard.mjs'

const bash = (command) => check({ tool_name: 'Bash', tool_input: { command } })
const tool = (tool_name, tool_input) => check({ tool_name, tool_input })

describe('guard: comandos de terminal', () => {
  it.each([
    'pnpm db:push',
    'pnpm exec prisma db push',
    'npx prisma migrate reset',
    'pnpm exec prisma migrate dev --force-reset',
    'prisma db push --accept-data-loss',
    'psql -c "DROP TABLE events"',
    'psql -c "drop database borave"',
    'psql -c "TRUNCATE tickets"',
    'git push --force',
    'git push -f origin main',
    'git push origin main --force',
    'git reset --hard HEAD~1',
    'git clean -fd',
    'git checkout -- .',
    'git restore .',
    'cat .env.local',
    'grep DATABASE_URL .env',
    'dotenv -e .env.local -- node script.js',
    'echo "x" >> .env.production',
  ])('bloqueia: %s', (command) => {
    expect(bash(command)).not.toBeNull()
  })

  it.each([
    'pnpm db:migrate',
    'pnpm db:generate',
    'pnpm test',
    'pnpm test:e2e',
    'git status',
    'git push origin main',
    'git push --force-with-lease',
    'git restore src/routes/index.tsx',
    'git reset src/db.ts',
    'cat .env.example',
    'ls src/environment',
    'pnpm add dotenv',
    'node scripts/check-envelope.js',
  ])('libera: %s', (command) => {
    expect(bash(command)).toBeNull()
  })
})

describe('guard: arquivos', () => {
  it.each([
    ['Read', { file_path: '/Users/x/borave/.env.local' }],
    ['Read', { file_path: '.env' }],
    ['Edit', { file_path: '/Users/x/borave/.env.local' }],
    ['Write', { file_path: '/Users/x/borave/.env.production' }],
    ['Grep', { pattern: 'DATABASE_URL', path: '/Users/x/borave/.env.local' }],
    ['Glob', { pattern: '**/.env.local' }],
  ])('bloqueia %s em arquivo de ambiente', (name, input) => {
    expect(tool(name, input)).not.toBeNull()
  })

  it.each([
    ['Read', { file_path: '/Users/x/borave/.env.example' }],
    ['Read', { file_path: '/Users/x/borave/src/db.ts' }],
    ['Edit', { file_path: '/Users/x/borave/src/database-url.ts' }],
    ['Grep', { pattern: 'DATABASE_URL', path: '/Users/x/borave/src' }],
  ])('libera %s em arquivo comum', (name, input) => {
    expect(tool(name, input)).toBeNull()
  })
})
