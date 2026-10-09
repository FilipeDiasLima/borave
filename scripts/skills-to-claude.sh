#!/usr/bin/env bash
# Deixa todas as skills do projeto em um lugar só: .claude/skills/
#
# O instalador de skills (npx skills / skills.sh) sempre instala em .agents/skills/
# e cria atalhos em .claude/skills/. Este script troca os atalhos pelas pastas de
# verdade, corrige os caminhos ".agents/skills/" escritos dentro das skills e apaga
# .agents/. Rode depois de instalar ou atualizar qualquer skill: pnpm skills:sync
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d .agents/skills ]; then
  echo "Nada em .agents/skills: as skills já estão só em .claude/skills."
  exit 0
fi

mkdir -p .claude/skills

for src in .agents/skills/*/; do
  name="$(basename "$src")"
  dest=".claude/skills/$name"
  # Atalho antigo do instalador: sai para dar lugar à pasta de verdade.
  if [ -L "$dest" ]; then rm "$dest"; fi
  if [ -e "$dest" ]; then
    echo "• $name: já existe em .claude/skills (mantido); a cópia de .agents é descartada."
  else
    mv "$src" "$dest"
    echo "• $name: movida para .claude/skills"
  fi
done

# Skills que citam o próprio caminho (ex.: impeccable chama .agents/skills/impeccable/scripts/...).
grep -rl '\.agents/skills/' .claude/skills 2>/dev/null | while IFS= read -r file; do
  perl -pi -e 's#\.agents/skills/#.claude/skills/#g' "$file"
  echo "• caminhos corrigidos em $file"
done

rm -rf .agents
echo "Pronto: skills só em .claude/skills e a pasta .agents foi removida."
