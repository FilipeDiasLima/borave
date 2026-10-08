import { CalendarDays, Clock, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'

import type { FeaturedEvent } from '#/data/featured-events'
import {
  formatDay,
  formatMonthShort,
  formatTime,
  formatWeekday,
} from '#/lib/format'
import { Poster } from './poster'

/** O que o cartaz não cabe: onde, quando, quem sobe ao palco e a história do show. */
type EventDetailsProps = {
  event: FeaturedEvent
  /** Prefixo dos ids da seção, para a ficha poder aparecer também dentro do modal. */
  idPrefix?: string
  /** Substitui o cartaz da coluna lateral (o modal usa o cartaz da transição). */
  posterSlot?: ReactNode
  variant?: 'page' | 'sheet'
}

export function EventDetails({
  event,
  idPrefix = '',
  posterSlot,
  variant = 'page',
}: EventDetailsProps) {
  const titleId = `${idPrefix}details-title`
  return (
    <section
      id={`${idPrefix}o-show`}
      className={variant === 'sheet' ? 'details details--sheet' : 'details'}
      aria-labelledby={titleId}
    >
      <div className="details__poster">
        <div className="details__poster-light" aria-hidden="true" />
        {posterSlot ?? <Poster event={event} lit eager />}
      </div>

      <div className="details__body">
        <header className="details__head">
          <h2 id={titleId} className="details__title font-display">
            {event.title}
          </h2>
          <p className="details__byline">{event.presenter}</p>
          <p className="details__lead">{event.description}</p>
        </header>

        <dl className="details__facts">
          <div className="fact">
            <dt className="fact__label">
              <CalendarDays aria-hidden="true" size={16} strokeWidth={1.75} />
              Quando
            </dt>
            <dd className="fact__value">
              <span className="fact__big font-display tabular">
                {formatDay(event.startsAt)} {formatMonthShort(event.startsAt)}
              </span>
              <span className="fact__small">
                {formatWeekday(event.startsAt)}
              </span>
            </dd>
          </div>
          <div className="fact">
            <dt className="fact__label">
              <Clock aria-hidden="true" size={16} strokeWidth={1.75} />
              Horário
            </dt>
            <dd className="fact__value">
              <span className="fact__big font-display tabular">
                {formatTime(event.startsAt)}
              </span>
              <span className="fact__small">
                Portões às {formatTime(event.doorsOpenAt)} ·{' '}
                {event.durationLabel}
              </span>
            </dd>
          </div>
          <div className="fact fact--wide">
            <dt className="fact__label">
              <MapPin aria-hidden="true" size={16} strokeWidth={1.75} />
              Onde
            </dt>
            <dd className="fact__value">
              <span className="fact__big font-display">{event.venue.name}</span>
              <span className="fact__small">
                {event.venue.address} · {event.venue.city}
              </span>
            </dd>
          </div>
        </dl>

        <div className="details__columns">
          <div className="details__story">
            <h3 className="details__subhead font-display">A história</h3>
            {event.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className="details__lineup">
            <h3 className="details__subhead font-display">No palco</h3>
            <ul className="lineup">
              {event.lineup.map((entry) => (
                <li key={entry.name} className="lineup__row">
                  <span className="lineup__name">{entry.name}</span>
                  <span className="lineup__role">{entry.role}</span>
                </li>
              ))}
            </ul>
            <p className="details__rating">Classificação: {event.ageRating}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
