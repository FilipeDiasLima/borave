import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    // Testes do app e testes do próprio harness (hooks do agente).
    include: ['src/**/*.test.ts', '.claude/hooks/**/*.test.mjs'],
  },
})
