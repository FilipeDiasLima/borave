import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

import type { FeaturedEvent } from '#/data/featured-events'
import { EventDetails } from './event-details'
import { Poster } from './poster'
import { TicketBooth } from './ticket-booth'

/** Nome compartilhado entre o card clicado e o cartaz do modal (View Transitions). */
export const EVENT_COVER_TRANSITION = 'event-cover'

type EventSheetProps = {
  event: FeaturedEvent
  onClose: () => void
}

/**
 * Página do evento aberta por cima da listagem. O cartaz daqui é o mesmo elemento
 * visual do card: a View Transition leva o card da posição dele até este lugar.
 */
export function EventSheet({ event, onClose }: EventSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-details-title"
    >
      <div className="sheet__scrim" onClick={onClose} aria-hidden="true" />
      <div className="sheet__panel">
        <button
          ref={closeRef}
          type="button"
          className="sheet__close"
          onClick={onClose}
          aria-label={`Fechar ${event.title}`}
        >
          <X aria-hidden="true" size={20} strokeWidth={1.75} />
        </button>

        <EventDetails
          event={event}
          idPrefix="sheet-"
          variant="sheet"
          posterSlot={
            <div
              className="sheet__cover"
              style={{ viewTransitionName: EVENT_COVER_TRANSITION }}
            >
              <Poster event={event} lit eager />
            </div>
          }
        />
        <TicketBooth key={event.id} event={event} idPrefix="sheet-" />
      </div>
    </div>
  )
}
