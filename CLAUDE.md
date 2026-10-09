# Bora Vê

Plataforma de venda de ingressos para eventos com capacidade limitada.

## Stack

- TanStack Start (React 19 + TanStack Router, roteamento por arquivos em `src/routes/`)
- TypeScript (strict) · Vite · Nitro · deploy na Vercel
- Prisma 7 + PostgreSQL (adapter `@prisma/adapter-pg`)
- Tailwind CSS 4 + shadcn/ui
- Gerenciador de pacotes: **pnpm** (nunca npm ou yarn)

## Comandos

| Comando            | Para quê                                                    |
| ------------------ | ----------------------------------------------------------- |
| `pnpm dev`         | Dev server em http://localhost:3000                         |
| `pnpm build`       | Build de produção                                           |
| `pnpm typecheck`   | Typecheck                                                   |
| `pnpm test`        | Testes (Vitest, execução única)                             |
| `pnpm test:e2e`    | Testes de navegador (Playwright, pasta `e2e/`)              |
| `pnpm skills:sync` | Move skills instaladas de `.agents/` para `.claude/skills/` |
| `pnpm lint`        | ESLint                                                      |
| `pnpm format`      | Prettier + ESLint --fix                                     |
| `pnpm db:migrate`  | Cria e aplica migration após mudar o schema                 |
| `pnpm db:generate` | Regenera o client do Prisma                                 |
| `pnpm db:seed`     | Popula o banco com dados de exemplo                         |

## Estrutura

- `src/routes/` — páginas e rotas (file-based routing)
- `src/domain/` — regras de negócio puras, com teste ao lado (`*.test.ts`). Nunca importe Prisma, React ou HTTP aqui: o lint só deixa importar do próprio domínio (`./`, `#/domain/`)
- `src/db.ts` — instância única do Prisma; sempre importe daqui
- `prisma/schema.prisma` — modelo de dados
- `src/contexts/` — contextos da aplicação, tudo que precisar ter um context deve ficar nessa pasta
- `src/hooks/` — os hooks comuns da aplicação devem ficar salvos nessa pasta (`use-media-query.ts`, `use-scroll-lock.ts`)
- `src/components/ui/` — componentes shadcn (base: Base UI, estilo `base-nova`). Os tokens do shadcn em `src/styles.css` (`--background`, `--primary`...) apontam para os tokens do Bora Vê; o site é sempre escuro (`<html class="dark">`). Botão é sempre `Button` (`#/components/ui/button`) com as variantes do Bora Vê: `default` (vermelho), `outline`, `secondary` (papel), `lamp` (tungstênio), `ghost`, `link`
- `src/components/home/` — home (muro de cartazes, ficha do show, bilheteria) e `home.css`
- `src/forms/` — as validações de formulários devem ser salvas nessa pasta
- `src/components/motion-primitives/` — componentes do motion-primitives (código copiado, pode editar). O CLI (`pnpm dlx motion-primitives@latest add <x>`) cria em `components/` na raiz e importa de `@/lib/utils`: mova para `src/components/motion-primitives/` e use imports `#/` e `import type`
- `src/data/` — eventos de EXEMPLO (fictícios) até o cadastro no banco existir: `featured-events.ts` (os 6 do muro, com `highlight`), `more-events.ts` (outros 15) e `all-events.ts` (todos, por data). `all-events.test.ts` valida os dados contra as regras do domínio
- `src/components/ui/parallax-scroll.tsx` — Parallax Scroll da Aceternity (`pnpm dlx shadcn@latest add @aceternity/parallax-scroll-demo`), com edição mínima marcada no topo do arquivo (`renderItem`, `gridClassName`). Ao atualizar pelo CLI, reaplique essas duas props
- `src/lib/scroll-to-section.ts` — `scrollToSection(id)`: leva até uma seção da página sem `#` na URL (a seção precisa de `tabIndex={-1}`)
- `src/lib/view-transition.ts` — `withViewTransition`: use para transições de elemento compartilhado (card → página do evento). Só um elemento por vez pode ter o mesmo `view-transition-name`
- `PRODUCT.md` — verdade do produto (público, posicionamento, o que não pode ser inventado)
- `DESIGN.md` — sistema visual: cores, tipografia e componentes. Leia antes de mexer em UI
- `e2e/` — testes de navegador (Playwright). `fixtures.ts` troca as fotos do Unsplash por cartazes falsos e falha o teste se a página tiver erro de JavaScript. `*.mobile.spec.ts` roda no celular (Pixel 7, toque); o resto no desktop (1440×900). O servidor dos testes sobe sozinho na porta 3100
- `.claude/skills/` — **todas** as skills do projeto, as instaladas (impeccable, shadcn, improve-codebase-architecture) e as nossas (audit, work-on). Não existe `.agents/`: o instalador (`npx skills`) cria essa pasta; depois de instalar ou atualizar uma skill, rode `pnpm skills:sync`
- `.claude/hooks/` — hooks do harness: antes de cada ação, `guard.mjs` bloqueia comandos destrutivos (`db push`, `migrate reset`, `DROP`/`TRUNCATE`, `git push --force`, `git reset --hard`) e qualquer acesso a `.env*` (regras testadas em `guard.test.mjs`); depois de cada edição de `.ts/.tsx`, typecheck + lint; ao concluir a tarefa, `pnpm test` e, se a tarefa mexeu em tela (`src/components`, `src/routes`, `src/styles.css`, `src/data`, `e2e`), `pnpm test:e2e`. Os erros que eles devolvem são para você corrigir na causa

## Fluxo de tarefas

- As tarefas ficam no Jira, projeto **BEH** (quadro Scrum: https://byintera.atlassian.net/jira/software/projects/BEH/boards/1373). Leia a tarefa inteira (objetivo, critério de aceite, fora do escopo, dependências) antes de começar.
- **Toda tarefa tem uma branch própria, criada a partir da `main` atualizada.** Nome: `BEH-<número>-<resumo-curto>` (ex.: `BEH-2-banco-prisma`). Nunca trabalhe direto na `main` nem reaproveite a branch de outra tarefa.
  ```
  git switch main && git pull && git switch -c BEH-2-banco-prisma
  ```
- Tarefa bloqueada por outra (vínculo "is blocked by" no Jira) só começa depois que a outra entrou na `main`.
- Para executar uma tarefa do início ao PR, use `/work-on BEH-<n>` (`.claude/skills/work-on`). O PR só entra na `main` com o CI verde (`.github/workflows/ci.yml`: typecheck, lint, testes, build e testes de navegador).
- Termine com o critério de aceite atendido e as checagens passando. Commit em uma frase, citando a tarefa (ex.: `feat(BEH-2): schema de conta e perfil no Prisma`).

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
- As rotas da url não devem ser preenchidas com "#" e evitar nomes compostos, exemplo a se evitar: "/#em-cartaz", deve ser: "/destaque". O lint barra `href="#..."`, `href="/#..."` e a prop `hash` do Link.

## Regras de trabalho

- Mudou o schema do Prisma? Use `pnpm db:migrate` (não `db:push`) e depois `pnpm db:generate`.
- Componente novo do shadcn: `pnpm dlx shadcn@latest add <componente>`. Depois de `add`/`init`, confira o `git diff` de `src/styles.css`: o CLI pode reescrever os tokens com cores neutras e trocar a fonte. `e2e/visual-identity.spec.ts` falha se isso acontecer.
- Mudou regra no `CLAUDE.md`, instalou/atualizou skill ou rodou CLI que gera código (shadcn)? Rode `/audit` (`.claude/skills/audit`) para conferir o projeto inteiro contra as regras novas.
- Nunca leia nem altere `.env.local` (nem nenhum `.env*`, exceto `.env.example`). O hook `guard.mjs` bloqueia.
- Ação bloqueada pelo `guard.mjs`? Não tente contornar com outro comando. Faça do jeito que a mensagem indica ou pare e peça ao usuário.
- Nunca use `eslint-disable` ou `@ts-ignore` para silenciar um erro. Corrija a causa ou pare e pergunte ao usuário.
- Antes de concluir uma tarefa: `pnpm typecheck`, `pnpm lint` e `pnpm test` precisam passar (e `pnpm test:e2e`, se mexeu em tela).
- Todo bug de tela que escapar vira um teste em `e2e/` que falha sem a correção. Teste pelo que a pessoa vê e faz (papel e nome acessível: `getByRole`), não por detalhes de implementação.
- Teste e2e quebrou? Corrija o código, não o teste. Só mude o teste se o comportamento esperado mudou de propósito, e diga isso ao usuário.
- User preferencialmente componentes prontos de libs que já entregam o componente, como shadcn, motion-primitives, kokonutUI e etc. Instalei uma skill de shadcn para ser usada e quando preciso, instalar novos componentes.
- Componentizar bem os arquivos, seguir um bom design patterns para o código não ficar muito poluído.
- Se tiver funções que estão se repetindo, deve-se globaliza no código, a fim de deixa-la acessível para todo o projeto reutiliza
- Os commits devem ser preferencialmente em uma unica sentença ou frase, evitando um commit longo
- Para formulários, use o React Hook Form com Zod para validação e @hookform/resolvers para integração entre eles, siga como modelo de exemplo o arquivo `src/examples/forms.txt`
