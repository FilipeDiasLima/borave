# Bora Vê

Plataforma de venda de ingressos para eventos com capacidade limitada.

## Stack

- TanStack Start (React 19 + TanStack Router, roteamento por arquivos em `src/routes/`)
- TypeScript (strict) · Vite · Nitro · deploy na Vercel
- Prisma 7 + PostgreSQL (adapter `@prisma/adapter-pg`)
- Tailwind CSS 4 + shadcn/ui
- Gerenciador de pacotes: **pnpm** (nunca npm ou yarn)

## Comandos

| Comando            | Para quê                                       |
| ------------------ | ---------------------------------------------- |
| `pnpm dev`         | Dev server em http://localhost:3000            |
| `pnpm build`       | Build de produção                              |
| `pnpm typecheck`   | Typecheck                                      |
| `pnpm test`        | Testes (Vitest, execução única)                |
| `pnpm test:e2e`    | Testes de navegador (Playwright, pasta `e2e/`) |
| `pnpm lint`        | ESLint                                         |
| `pnpm format`      | Prettier + ESLint --fix                        |
| `pnpm db:migrate`  | Cria e aplica migration após mudar o schema    |
| `pnpm db:generate` | Regenera o client do Prisma                    |
| `pnpm db:seed`     | Popula o banco com dados de exemplo            |

## Estrutura

- `src/routes/` — páginas e rotas (file-based routing)
- `src/domain/` — regras de negócio puras, com teste ao lado (`*.test.ts`). Nunca importe Prisma, React ou HTTP aqui
- `src/db.ts` — instância única do Prisma; sempre importe daqui
- `prisma/schema.prisma` — modelo de dados
- `src/components/ui/` — componentes shadcn
- `src/components/home/` — home (muro de cartazes, ficha do show, bilheteria) e `home.css`
- `src/components/motion-primitives/` — componentes do motion-primitives (código copiado, pode editar). O CLI (`pnpm dlx motion-primitives@latest add <x>`) cria em `components/` na raiz e importa de `@/lib/utils`: mova para `src/components/motion-primitives/` e use imports `#/` e `import type`
- `src/data/` — eventos de EXEMPLO (fictícios) até o cadastro no banco existir: `featured-events.ts` (os 6 do muro, com `highlight`), `more-events.ts` (outros 15) e `all-events.ts` (todos, por data). `all-events.test.ts` valida os dados contra as regras do domínio
- `src/components/ui/parallax-scroll.tsx` — Parallax Scroll da Aceternity (`pnpm dlx shadcn@latest add @aceternity/parallax-scroll-demo`), com edição mínima marcada no topo do arquivo (`renderItem`, `gridClassName`). Ao atualizar pelo CLI, reaplique essas duas props
- `src/lib/view-transition.ts` — `withViewTransition`: use para transições de elemento compartilhado (card → página do evento). Só um elemento por vez pode ter o mesmo `view-transition-name`
- `PRODUCT.md` — verdade do produto (público, posicionamento, o que não pode ser inventado)
- `DESIGN.md` — sistema visual: cores, tipografia e componentes. Leia antes de mexer em UI
- `e2e/` — testes de navegador (Playwright). `fixtures.ts` troca as fotos do Unsplash por cartazes falsos e falha o teste se a página tiver erro de JavaScript. `*.mobile.spec.ts` roda no celular (Pixel 7, toque); o resto no desktop (1440×900). O servidor dos testes sobe sozinho na porta 3100
- `.claude/hooks/` — hooks do harness: typecheck + lint após cada edição de `.ts/.tsx`; ao concluir a tarefa, `pnpm test` e, se a tarefa mexeu em tela (`src/components`, `src/routes`, `src/styles.css`, `src/data`, `e2e`), `pnpm test:e2e`. Os erros que eles devolvem são para você corrigir na causa

## Arquivos gerados (nunca edite à mão)

- `src/routeTree.gen.ts` — gerado pelo TanStack Router
- `src/generated/prisma/` — gerado por `pnpm db:generate`

## Regras

- **Invariante principal:** um evento nunca pode vender mais ingressos do que a sua capacidade, nem com compras simultâneas.
- Valores monetários sempre em centavos (inteiro), nunca float. Formate com `formatBRL` (`src/lib/format.ts`).
- Cores só pelos tokens de `src/styles.css`; cor arbitrária em className é barrada pelo lint.
- Deve haver camada de middleware para autenticação, com validação de token.
- Cookie de auth: sempre `HttpOnly`, `Secure` e `SameSite=Lax`. Nunca expor o token para o JavaScript do cliente.
- Nunca salvar nenhum tipo de dado sensível no localStorage do navegador e se for necessário ou recomendado, deve ser pedido a permissão para prosseguir

## Regras de trabalho

- Mudou o schema do Prisma? Use `pnpm db:migrate` (não `db:push`) e depois `pnpm db:generate`.
- Componente novo do shadcn: `pnpm dlx shadcn@latest add <componente>`.
- Nunca leia nem altere `.env.local`.
- Nunca use `eslint-disable` ou `@ts-ignore` para silenciar um erro. Corrija a causa ou pare e pergunte ao usuário.
- Antes de concluir uma tarefa: `pnpm typecheck`, `pnpm lint` e `pnpm test` precisam passar (e `pnpm test:e2e`, se mexeu em tela).
- Todo bug de tela que escapar vira um teste em `e2e/` que falha sem a correção. Teste pelo que a pessoa vê e faz (papel e nome acessível: `getByRole`), não por detalhes de implementação.
- Teste e2e quebrou? Corrija o código, não o teste. Só mude o teste se o comportamento esperado mudou de propósito, e diga isso ao usuário.
