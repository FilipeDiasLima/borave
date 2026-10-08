export function SiteHeader() {
  return (
    <header className="site-header">
      <a href="#em-cartaz" className="site-header__brand font-display">
        Bora Vê
      </a>
      <nav aria-label="Seções da página" className="site-header__nav">
        <a href="#em-cartaz">Em cartaz</a>
        <a href="#o-show">O show</a>
        <a href="#ingressos" className="site-header__cta">
          Ingressos
        </a>
      </nav>
    </header>
  )
}
