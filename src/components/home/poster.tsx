import type { FeaturedEvent } from '#/data/featured-events'
import { formatShortDateTime } from '#/lib/format'
import { cn } from '#/lib/utils'

type PosterProps = {
  event: FeaturedEvent
  lit: boolean
  eager?: boolean
  className?: string
}

/** Um cartaz colado no muro: foto do evento com a tipografia de cartaz por cima. */
export function Poster({ event, lit, eager = false, className }: PosterProps) {
  const { poster } = event

  return (
    <figure
      className={cn('poster', className)}
      data-tone={poster.tone}
      data-layout={poster.layout}
      data-lit={lit ? 'true' : 'false'}
    >
      <img
        className="poster__photo"
        src={poster.src}
        alt={poster.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
      <div className="poster__grade" aria-hidden="true" />
      <figcaption className="poster__type">
        <span className="poster__presenter">{event.presenter}</span>
        <span className="poster__title font-display">{event.title}</span>
        <span className="poster__meta tabular">
          {formatShortDateTime(event.startsAt)}
          <br />
          {event.venue.name}
        </span>
      </figcaption>
    </figure>
  )
}
