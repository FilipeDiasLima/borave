// Hook PreToolUse: roda ANTES de cada comando ou acesso a arquivo do agente.
// Se a ação estiver na lista de proibidas, sai com código 2: a ação nem acontece,
// e a mensagem volta para o agente explicando o que fazer no lugar.
//
// O CLAUDE.md pede; este hook garante. O agente pode esquecer um pedido, mas não
// consegue passar por cima de um bloqueio.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/** Arquivos de ambiente têm segredos. Só o `.env.example` (sem segredos) é liberado. */
const ENV_FILE = /(^|[\s/'"=:])\.env(\.(?!example\b)[\w.-]+)?(?=$|[\s'";|&)])/

/** Comandos de terminal proibidos, com o que fazer no lugar. */
const COMMAND_RULES = [
  {
    pattern: /\bprisma\s+db\s+push\b|\bdb:push\b/,
    message:
      '`db push` muda o banco sem migration e pode apagar dados. Use `pnpm db:migrate` (CLAUDE.md > Regras de trabalho).',
  },
  {
    pattern:
      /\bprisma\s+migrate\s+reset\b|--force-reset\b|--accept-data-loss\b/,
    message:
      'Comando que apaga o banco ou aceita perda de dados. Se precisar mesmo zerar o banco, pare e peça ao usuário para rodar.',
  },
  {
    pattern: /\b(drop\s+(table|database|schema)|truncate\s+(table\s+)?\w)/i,
    message:
      'SQL destrutivo (DROP/TRUNCATE). Mudança de estrutura vai por migration (`pnpm db:migrate`); apagar dados, só o usuário decide.',
  },
  {
    pattern: /\bgit\s+push\b.*(\s--force(?!-with-lease)\b|\s-f\b)/,
    message:
      '`git push --force` reescreve o histórico do repositório. Não force push; se o push foi recusado, pare e explique ao usuário.',
  },
  {
    pattern:
      /\bgit\s+(reset\s+--hard|clean\s+-\w*f|checkout\s+--\s+\.|restore\s+(--\S+\s+)*\.(\s|$))/,
    message:
      'Comando que descarta mudanças não commitadas (inclusive do usuário). Não use; se precisar desfazer algo seu, desfaça arquivo por arquivo.',
  },
]

const ENV_MESSAGE =
  'Arquivos `.env*` têm segredos: nunca leia nem altere (CLAUDE.md > Regras de trabalho). Se precisar de uma variável nova, documente no `.env.example` e peça ao usuário para preencher.'

/**
 * Decide se a ação do agente pode acontecer.
 * @param {{ tool_name?: string, tool_input?: Record<string, unknown> }} input
 * @returns {string | null} motivo do bloqueio, ou `null` se estiver liberado
 */
export function check({ tool_name: tool, tool_input: params = {} }) {
  if (tool === 'Bash') {
    const command = String(params.command ?? '')
    if (ENV_FILE.test(command)) return ENV_MESSAGE
    const rule = COMMAND_RULES.find(({ pattern }) => pattern.test(command))
    return rule ? rule.message : null
  }
  // Leitura, edição e busca: olha os caminhos que a ferramenta vai tocar.
  const paths = [
    params.file_path,
    params.path,
    params.notebook_path,
    params.pattern,
  ].filter((value) => typeof value === 'string')
  return paths.some((path) => ENV_FILE.test(path)) ? ENV_MESSAGE : null
}

// Rodando como hook (e não importado pelo teste): lê a ação do stdin e decide.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
  const reason = check(input)
  if (reason) {
    console.error(`Ação bloqueada pelo harness: ${reason}`)
    process.exit(2)
  }
  process.exit(0)
}
