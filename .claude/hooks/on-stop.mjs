// Hook Stop: roda quando o agente acha que terminou a tarefa.
// Se os testes falharem, sai com código 2 e o agente NÃO pode parar: precisa corrigir.
//
// 1. Testes de unidade (Vitest): sempre. São rápidos.
// 2. Testes de navegador (Playwright): só se a tarefa mexeu na tela (componentes,
//    rotas, estilos ou os próprios testes e2e). Levam ~1,5 min, então não rodam à toa.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

/** O que, se mudou, pode quebrar a tela. */
const UI_PATHS = [
  'src/components',
  'src/routes',
  'src/styles.css',
  'src/data',
  'e2e',
  'playwright.config.ts',
]

const run = (command, args) =>
  spawnSync(command, args, { cwd, encoding: 'utf8' })

/** Erro do próprio harness (ferramenta faltando): avisa você, não culpa o agente. */
function harnessBroken(message) {
  console.error(`Hook Stop não conseguiu rodar: ${message}`)
  process.exit(1)
}

function fail(title, result) {
  // Só o fim da saída: é onde o Playwright e o Vitest resumem o que quebrou.
  const output = `${result.stdout}${result.stderr}`.slice(-8000)

  // Proteção contra loop infinito: se o agente já foi barrado uma vez e os testes
  // continuam falhando, deixa ele parar e avisa você, em vez de tentar para sempre.
  if (input.stop_hook_active) {
    console.error(
      `${title} continuam falhando após uma tentativa de correção. Revisão humana necessária.\n${output}`,
    )
    process.exit(1)
  }
  console.error(
    `${title} falharam. Corrija antes de concluir a tarefa:\n${output}`,
  )
  process.exit(2)
}

const unit = run('pnpm', ['-s', 'test'])
if (unit.error) harnessBroken(unit.error.message)
if (unit.status !== 0) fail('Os testes de unidade', unit)

const changed = run('git', [
  '--no-optional-locks',
  'status',
  '--porcelain',
  '--',
  ...UI_PATHS,
])
if (changed.error || changed.status !== 0) harnessBroken('git status falhou')
if (changed.stdout.trim() === '') process.exit(0)

const e2e = run('pnpm', ['-s', 'test:e2e', '--reporter=line'])
if (e2e.error) harnessBroken(e2e.error.message)
if (
  /Executable doesn't exist|playwright install/.test(
    `${e2e.stdout}${e2e.stderr}`,
  )
) {
  harnessBroken(
    'o navegador do Playwright não está instalado. Rode `pnpm exec playwright install chromium`.',
  )
}
if (e2e.status !== 0) fail('Os testes de navegador', e2e)
process.exit(0)
