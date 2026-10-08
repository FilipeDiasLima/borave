// Hook PostToolUse: roda depois de cada Edit/Write do agente.
// Se typecheck ou lint falharem, sai com código 2 e o erro volta para o agente corrigir.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const file = input.tool_input?.file_path ?? ''

// Só checa arquivos TypeScript. Editar o CLAUDE.md, por exemplo, não dispara nada.
if (!/\.(ts|tsx)$/.test(file)) process.exit(0)

const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const run = (args) => spawnSync('pnpm', args, { cwd, encoding: 'utf8' })

const checks = [
  { name: 'typecheck', result: run(['-s', 'typecheck']) },
  // Lint só no arquivo editado: muito mais rápido que o projeto inteiro.
  { name: `lint em ${file}`, result: run(['-s', 'exec', 'eslint', file]) },
]

// Falha do próprio harness (ex.: pnpm não encontrado) não é culpa do agente: avisa você, sem bloquear.
const broken = checks.find((c) => c.result.error)
if (broken) {
  console.error(`Hook não conseguiu rodar ${broken.name}: ${broken.result.error.message}`)
  process.exit(1)
}

const failures = checks.filter((c) => c.result.status !== 0)
if (failures.length === 0) process.exit(0)

for (const { name, result } of failures) {
  console.error(`\n✖ ${name} falhou:\n${result.stdout}${result.stderr}`)
}
console.error('\nCorrija a causa dos erros acima. Não use eslint-disable nem @ts-ignore (CLAUDE.md > Regras de trabalho).')
process.exit(2)
