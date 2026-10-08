import { flushSync } from 'react-dom'

/**
 * Roda uma atualização de estado dentro de uma View Transition (quando o navegador
 * suporta e o usuário não pediu movimento reduzido). `flushSync` garante que o DOM
 * novo exista quando o navegador tira a "foto" do estado final.
 */
export function withViewTransition(update: () => void): Promise<void> {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!('startViewTransition' in document) || reduced) {
    update()
    return Promise.resolve()
  }
  const transition = document.startViewTransition(() => flushSync(update))
  return transition.finished.catch(() => undefined)
}
