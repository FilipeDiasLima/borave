import type { FeaturedEvent } from '#/data/featured-events'

export function SiteFooter({ events }: { events: Array<FeaturedEvent> }) {
  return (
    <footer className="site-footer">
      <p className="site-footer__mark font-display" aria-hidden="true">
        Bora Vê
      </p>
      <div className="site-footer__notes">
        <p>
          Projeto de estudo. Eventos, artistas, locais e números de venda desta
          página são fictícios.
        </p>
        <p>
          Fotos dos cartazes:{' '}
          {events.map((event, index) => (
            <span key={event.id}>
              <a href={event.poster.creditUrl} target="_blank" rel="noreferrer">
                {event.title}
              </a>
              {index < events.length - 1 ? ', ' : ''}
            </span>
          ))}
          {' e '}
          <a href="https://unsplash.com/photos/lZzlMYL7Q0Y" target="_blank" rel="noreferrer">
            muro
          </a>{' '}
          (Unsplash).
        </p>
      </div>
    </footer>
  )
}
