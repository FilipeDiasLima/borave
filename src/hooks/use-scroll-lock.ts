import { useEffect } from 'react'

/** Trava a rolagem da página enquanto `locked` for verdadeiro (overlays, modais). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [locked])
}
