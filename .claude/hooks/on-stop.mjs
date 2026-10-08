// Hook Stop: roda quando o agente acha que terminou a tarefa.
// Se os testes falharem, sai com código 2 e o agente NÃO pode parar: precisa corrigir.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

const result = spawnSync('pnpm', ['-s', 'test'], { cwd, encoding: 'utf8' })
if (result.error) {
  console.error(`Hook não conseguiu rodar os testes: ${result.error.message}`)
  process.exit(1)
}
if (result.status === 0) process.exit(0)

const output = `${result.stdout}${result.stderr}`

// Proteção contra loop infinito: se o agente já foi barrado uma vez e os testes
// continuam falhando, deixa ele parar e avisa você, em vez de tentar para sempre.
if (input.stop_hook_active) {
  console.error(`Os testes continuam falhando após uma tentativa de correção. Revisão humana necessária.\n${output}`)
  process.exit(1)
}

console.error(`Os testes falharam. Corrija antes de concluir a tarefa:\n${output}`)
process.exit(2)
