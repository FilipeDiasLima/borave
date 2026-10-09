import { useSyncExternalStore } from 'react'

/**
 * Acompanha uma media query (`'(min-width: 721px)'`, `'(prefers-reduced-motion: reduce)'`...).
 * No servidor não existe tela: devolve `serverValue` e o navegador corrige na hidratação.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}
