/**
 * Leva a página até uma seção sem mexer na URL (CLAUDE.md > Regras: nada de `#` nas rotas).
 * A rolagem suave e o recuo do cabeçalho vêm do CSS (`scroll-behavior`, `scroll-padding-top`),
 * que já respeitam `prefers-reduced-motion`.
 *
 * O foco vai junto para a seção (ela precisa de `tabIndex={-1}`), como um link de âncora faria:
 * quem navega pelo teclado continua dali.
 */
export function scrollToSection(id: string) {
  const section = document.getElementById(id)
  if (!section) return
  section.scrollIntoView()
  section.focus({ preventScroll: true })
}
