# Bora Vê

Plataforma de venda de ingressos para eventos com capacidade limitada.

## Stack

- TanStack Start (React 19 + TanStack Router, roteamento por arquivos em `src/routes/`)
- TypeScript (strict) · Vite · Nitro · deploy na Vercel
- Prisma 7 + PostgreSQL (adapter `@prisma/adapter-pg`)
- Tailwind CSS 4 + shadcn/ui
- Gerenciador de pacotes: **pnpm** (nunca npm ou yarn)

## Comandos

| Comando                  | Para quê                                    |
| ------------------------ | ------------------------------------------- |
| `pnpm dev`               | Dev server em http://localhost:3000         |
| `pnpm build`             | Build de produção                           |
| `pnpm typecheck`         | Typecheck                                   |
| `pnpm test`              | Testes (Vitest, execução única)             |
| `pnpm lint`              | ESLint                                      |
| `pnpm format`            | Prettier + ESLint --fix                     |
| `pnpm db:migrate`        | Cria e aplica migration após mudar o schema |
| `pnpm db:generate`       | Regenera o client do Prisma                 |
| `pnpm db:seed`           | Popula o banco com dados de exemplo         |

## Estrutura

- `src/routes/` — páginas e rotas (file-based routing)
- `src/domain/` — regras de negócio puras, com teste ao lado (`*.test.ts`). Nunca importe Prisma, React ou HTTP aqui
- `src/db.ts` — instância única do Prisma; sempre importe daqui
- `prisma/schema.prisma` — modelo de dados
- `src/components/ui/` — componentes shadcn

## Arquivos gerados (nunca edite à mão)

- `src/routeTree.gen.ts` — gerado pelo TanStack Router
- `src/generated/prisma/` — gerado por `pnpm db:generate`

## Regras

- **Invariante principal:** um evento nunca pode vender mais ingressos do que a sua capacidade, nem com compras simultâneas.
- Valores monetários sempre em centavos (inteiro), nunca float.
- Deve haver camada de middleware para autenticação, com validação de token.
- Cookie de auth: sempre `HttpOnly`, `Secure` e `SameSite=Lax`. Nunca expor o token para o JavaScript do cliente.
- Nunca salvar nenhum tipo de dado sensível no localStorage do navegador e se for necessário ou recomendado, deve ser pedido a permissão para prosseguir

## Regras de trabalho

- Mudou o schema do Prisma? Use `pnpm db:migrate` (não `db:push`) e depois `pnpm db:generate`.
- Componente novo do shadcn: `pnpm dlx shadcn@latest add <componente>`.
- Nunca leia nem altere `.env.local`.
- Nunca use `eslint-disable` ou `@ts-ignore` para silenciar um erro. Corrija a causa ou pare e pergunte ao usuário.
- Antes de concluir uma tarefa: `pnpm typecheck`, `pnpm lint` e `pnpm test` precisam passar.
