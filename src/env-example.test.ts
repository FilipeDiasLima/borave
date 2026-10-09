import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const root = new URL('../', import.meta.url)

function readEnvExample() {
  const entries = readFileSync(new URL('.env.example', root), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [name, ...value] = line.split('=')
      return { name, value: value.join('=') }
    })
  return new Map(entries.map(({ name, value }) => [name, value]))
}

// As variáveis que a aplicação usa são as que o CI precisa definir (bloco `env:` do topo).
function readCiEnvNames() {
  const ci = readFileSync(new URL('.github/workflows/ci.yml', root), 'utf8')
  const block = ci.match(/^env:\n((?: {2}.*\n|\s*\n)+)/m)?.[1] ?? ''
  return [...block.matchAll(/^ {2}([A-Z][A-Z0-9_]*):/gm)].map((m) => m[1])
}

describe('.env.example', () => {
  it('documenta todas as variáveis que o CI define', () => {
    const documented = readEnvExample()
    const required = readCiEnvNames()

    expect(required).toEqual(
      expect.arrayContaining([
        'DATABASE_URL',
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
      ]),
    )
    for (const name of required) {
      expect(documented.has(name), `${name} falta no .env.example`).toBe(true)
    }
  })

  it('não traz nenhum valor preenchido', () => {
    for (const [name, value] of readEnvExample()) {
      expect(value, `${name} deveria estar vazia no .env.example`).toBe('')
    }
  })
})
