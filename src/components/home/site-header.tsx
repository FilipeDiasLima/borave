import { Link } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { scrollToSection } from '#/lib/scroll-to-section'

type SiteHeaderProps = {
  onOpenAll: (from: HTMLElement) => void
}

export function SiteHeader({ onOpenAll }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link
        to="/"
        className="site-header__brand font-display"
        onClick={() => window.scrollTo({ top: 0 })}
      >
        Bora Vê
      </Link>
      <nav aria-label="Seções da página" className="site-header__nav">
        <button
          type="button"
          className="site-header__link site-header__link--desktop"
          onClick={() => scrollToSection('em-cartaz')}
        >
          Destaques
        </button>
        <button
          type="button"
          className="site-header__link"
          onClick={(e) => onOpenAll(e.currentTarget)}
        >
          <span className="site-header__long">Todos os eventos</span>
          <span className="site-header__short">Eventos</span>
        </button>
        <Button
          variant="lamp"
          size="sm"
          onClick={() => scrollToSection('ingressos')}
        >
          Ingressos
        </Button>
      </nav>
    </header>
  )
}
