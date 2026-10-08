type SiteHeaderProps = {
  onOpenAll: (from: HTMLElement) => void
}

export function SiteHeader({ onOpenAll }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a href="#em-cartaz" className="site-header__brand font-display">
        Bora Vê
      </a>
      <nav aria-label="Seções da página" className="site-header__nav">
        <a href="#em-cartaz">Destaques</a>
        <button
          type="button"
          className="site-header__link"
          onClick={(e) => onOpenAll(e.currentTarget)}
        >
          <span className="site-header__long">Todos os eventos</span>
          <span className="site-header__short">Eventos</span>
        </button>
        <a href="#ingressos" className="site-header__cta">
          Ingressos
        </a>
      </nav>
    </header>
  )
}
