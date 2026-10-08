import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'

import { ParallaxScroll } from '#/components/ui/parallax-scroll'
import type { FeaturedEvent } from '#/data/featured-events'
import { formatShortDateTime } from '#/lib/format'
import { withViewTransition } from '#/lib/view-transition'
import { EVENT_COVER_TRANSITION, EventSheet } from './event-sheet'
import { Poster } from './poster'

export type ListingOrigin = { x: number; y: number }

type EventsListingProps = {
  open: boolean
  /** Centro do botão que abriu a listagem: a abertura cresce a partir dele. */
  origin: ListingOrigin
  events: Array<FeaturedEvent>
  onClose: () => void
}

const OPEN_EASE = [0.16, 1, 0.3, 1] as const

export function EventsListing({
  open,
  origin,
  events,
  onClose,
}: EventsListingProps) {
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<FeaturedEvent | null>(null)
  const cards = useRef(new Map<string, HTMLButtonElement>())
  const closeRef = useRef<HTMLButtonElement>(null)

  const openEvent = (event: FeaturedEvent) => {
    const card = cards.current.get(event.id)
    // Antes da foto do estado atual, só o card clicado leva o nome compartilhado...
    if (card) card.style.viewTransitionName = EVENT_COVER_TRANSITION
    void withViewTransition(() => {
      // ...e no estado novo quem leva o nome é o cartaz do modal.
      if (card) card.style.viewTransitionName = ''
      setSelected(event)
    })
  }

  const closeEvent = () => {
    if (!selected) return
    const card = cards.current.get(selected.id)
    void withViewTransition(() => {
      setSelected(null)
      // O cartaz do modal some e o card volta a ser o dono do nome: ele "encolhe" de volta.
      if (card) card.style.viewTransitionName = EVENT_COVER_TRANSITION
    }).then(() => {
      if (card) {
        card.style.viewTransitionName = ''
        card.focus({ preventScroll: true })
      }
    })
  }

  // Trava o scroll da página por baixo e avisa o carrossel para ignorar as setas.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.dataset.overlay = 'true'
    root.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      delete root.dataset.overlay
      root.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (selected) closeEvent()
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const circle = (radius: string) =>
    `circle(${radius} at ${origin.x}px ${origin.y}px)`

  return (
    <AnimatePresence onExitComplete={() => setSelected(null)}>
      {open && (
        <motion.div
          key="listing"
          className="listing"
          role="dialog"
          aria-modal="true"
          aria-labelledby="listing-title"
          initial={reduced ? { opacity: 0 } : { clipPath: circle('0px') }}
          animate={reduced ? { opacity: 1 } : { clipPath: circle('150vmax') }}
          exit={reduced ? { opacity: 0 } : { clipPath: circle('0px') }}
          transition={{ duration: reduced ? 0.2 : 0.75, ease: OPEN_EASE }}
        >
          <header className="listing__head">
            <div>
              <h2 id="listing-title" className="listing__title font-display">
                Todos os eventos
              </h2>
              <p className="listing__count tabular">
                {events.length} eventos em cartaz · os destacados estão no muro
                da home
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="listing__close"
              onClick={onClose}
              aria-label="Fechar a listagem de eventos"
            >
              <X aria-hidden="true" size={20} strokeWidth={1.75} />
            </button>
          </header>

          <ParallaxScroll
            className="listing__scroll"
            gridClassName="listing__grid"
            images={events.map((event) => event.poster.src)}
            renderItem={(_, index) => {
              const event = events[index]
              return (
                <button
                  ref={(element) => {
                    if (element) cards.current.set(event.id, element)
                    else cards.current.delete(event.id)
                  }}
                  type="button"
                  className="listing__card"
                  onClick={() => openEvent(event)}
                  aria-label={`Abrir ${event.title}, ${formatShortDateTime(event.startsAt)}, ${event.venue.name}`}
                >
                  <Poster event={event} lit />
                </button>
              )
            }}
          />

          {selected && <EventSheet event={selected} onClose={closeEvent} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
