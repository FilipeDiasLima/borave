---
name: audit
description: Varre o projeto Bora Vê contra as regras atuais (CLAUDE.md, DESIGN.md, PRODUCT.md e skills instaladas), reporta o que está fora, corrige e transforma em checagem automática o que der. Use depois de mudar regras, instalar ou atualizar skills, rodar CLIs que geram código (shadcn init/add) ou antes de uma feature grande.
argument-hint: "[escopo opcional: pasta, arquivo ou tema, ex.: src/components, tema, rotas]"
disable-model-invocation: true
---

# Audit: o projeto segue as regras de hoje?

Regras mudam: o usuário edita o `CLAUDE.md`, instala skills e roda CLIs que geram código.
Esta skill confere o código inteiro (ou o escopo em `$ARGUMENTS`) contra as regras **atuais**,
corrige o que está fora e fecha a porta para o mesmo desvio voltar.

## 1. Juntar as regras

Leia, nesta ordem, e anote cada regra verificável numa lista (uma linha por regra, com a fonte):

1. `CLAUDE.md`: seções Estrutura, Regras e Regras de trabalho.
2. `DESIGN.md` e `PRODUCT.md`.
3. Cada skill em `.claude/skills/*/SKILL.md`, junto com os arquivos de regras que ela cita (ex.: `shadcn/rules/*.md`). Só entram as regras que se aplicam a este projeto (ex.: o shadcn aqui é Base UI, não Radix: veja `components.json`).
4. O que mudou desde o último commit nesses arquivos (`git diff HEAD -- CLAUDE.md DESIGN.md .agents .claude components.json package.json src/styles.css`). Regra nova é onde mais aparece desvio.

Classifique cada regra:

- **Automática**: já barrada por lint, hook ou teste. Diga qual (ex.: "cor solta → lint `no-restricted-syntax`").
- **Buscável**: dá para achar violação com busca (`grep`), ex.: `href="#`, `localStorage`.
- **De julgamento**: precisa ler o código, ex.: "componentizar bem", "função repetida vira global".

## 2. Rodar as checagens automáticas

```
pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e
```

Falha aqui já é achado. Não silencie nada (`eslint-disable`, `@ts-ignore` e pular teste são proibidos).

## 3. Varrer o código

Escopo padrão: `src/`, `e2e/`, `prisma/` e os arquivos de configuração da raiz. Fora do escopo:
`src/routeTree.gen.ts`, `src/generated/`, `node_modules/`, `.output/`, `test-results/`, `.env*` (nunca abra).

- Regras buscáveis: uma busca por regra.
- Regras de julgamento: leia os componentes, rotas, `lib/`, `hooks/` e `domain/` inteiros.
- Arquivos gerados por CLI (shadcn, motion-primitives, aceternity) seguem as regras do projeto também
  (imports `#/`, `import type`, tokens). Confira em especial o `git diff` de `src/styles.css`: o
  `shadcn init/add` costuma reescrever os tokens e a fonte.
- Para mudança de visual, olhe a tela: rode `pnpm test:e2e` e, se precisar, tire screenshot da home
  no desktop (1440×900) e no celular (390×844).

## 4. Relatório antes de mexer

Mostre ao usuário uma tabela curta, do mais grave para o menos grave:

| Regra (fonte) | Situação | Onde | Correção proposta |
| ------------- | -------- | ---- | ----------------- |

Situação: **fora**, **ok** ou **não se aplica ainda** (ex.: regra de formulário sem nenhum formulário).
Liste só as regras fora e as que precisam de decisão; as que estão ok entram numa linha de resumo.

**Pergunte antes de corrigir** (AskUserQuestion, com a opção recomendada primeiro) quando:
houver mais de um jeito razoável, a correção mudar o visual ou o comportamento, for uma refatoração
grande, ou mexer em dependências. Correção óbvia e pequena pode seguir direto.

## 5. Corrigir

- Corrija a causa, no estilo do código ao redor. Uma regra por vez, para o diff ficar legível.
- Não reformate arquivos que não fazem parte da correção.
- Nada de `.env*`, nada de comando bloqueado pelo `guard.mjs`.

## 6. Fechar a porta (o mais importante)

Para cada desvio corrigido, pergunte: **dá para uma máquina pegar isso da próxima vez?**

- Padrão de código → regra de lint em `eslint.config.js`, com mensagem que diz o que fazer no lugar.
- Comportamento ou visual → teste em `e2e/` (ex.: `visual-identity.spec.ts`).
- Comando perigoso → regra no `.claude/hooks/guard.mjs` + caso em `guard.test.mjs`.
- Regra de negócio → teste em `src/domain/`.

Prove que a checagem nova funciona: reintroduza o desvio de propósito, veja falhar, desfaça.
Atualize o `CLAUDE.md` dizendo qual checagem protege a regra.

## 7. Conferir e entregar

1. `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e` passando.
2. Resumo final: o que estava fora, o que foi corrigido, quais checagens novas entraram e o que ficou
   para decisão do usuário.
3. Sugira a mensagem de commit em **uma única frase** (regra do `CLAUDE.md`). Não faça commit nem
   push sem o usuário pedir.
