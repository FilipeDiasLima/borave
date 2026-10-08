import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'

import type { FeaturedEvent } from '#/data/featured-events'
import { formatShortDateTime } from '#/lib/format'
import { Lamp } from './lamp'
import { Poster } from './poster'

type PosterWallProps = {
  events: Array<FeaturedEvent>
  activeIndex: number
  onChange: (index: number) => void
}

type Direction = 'next' | 'prev'

const SWIPE_THRESHOLD_PX = 48

/**
 * Posição circular de um cartaz em relação ao cartaz iluminado.
 * 0 = sob a lâmpada; negativos à esquerda; positivos à direita.
 */
function circularOffset(
  index: number,
  active: number,
  total: number,
  direction: Direction,
): number {
  let offset = (((index - active) % total) + total) % total
  if (offset > total / 2) offset -= total
  // Com quantidade par, o cartaz oposto fica ambíguo: entra pelo lado do movimento.
  if (total % 2 === 0 && Math.abs(offset) === total / 2) {
    offset = direction === 'next' ? total / 2 : -total / 2
  }
  return offset
}

export function PosterWall({ events, activeIndex, onChange }: PosterWallProps) {
  const total = events.length
  const active = events[activeIndex]
  const [direction, setDirection] = useState<Direction>('next')
  const [flickerKey, setFlickerKey] = useState(0)
  const previousOffsets = useRef(new Map<string, number>())
  const dragStartX = useRef<number | null>(null)
  const dragged = useRef(false)
  const heroRef = useRef<HTMLElement>(null)

  const go = (target: number, dir: Direction) => {
    setDirection(dir)
    setFlickerKey((key) => key + 1)
    onChange(((target % total) + total) % total)
  }
  const next = () => go(activeIndex + 1, 'next')
  const prev = () => go(activeIndex - 1, 'prev')

  const offsets = events.map((event, index) => {
    const offset = circularOffset(index, activeIndex, total, direction)
    const before = previousOffsets.current.get(event.id)
    // Um salto maior que uma casa é a volta do carrossel infinito: teletransporta sem deslizar.
    const jump = before !== undefined && Math.abs(offset - before) > 1
    return { event, index, offset, jump }
  })

  useEffect(() => {
    offsets.forEach(({ event, offset }) => previousOffsets.current.set(event.id, offset))
  })

  // Setas do teclado trocam de cartaz quando ninguém está digitando.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Conforme a página desce, a luz da rua vai ficando para trás.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    let frame = 0
    const update = () => {
      frame = 0
      const progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight))
      hero.style.setProperty('--scroll', progress.toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX
    dragged.current = false
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return
    const dx = e.clientX - dragStartX.current
    dragStartX.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return
    dragged.current = true
    if (dx < 0) next()
    else prev()
  }

  return (
    <section
      ref={heroRef}
      id="em-cartaz"
      className="wall"
      aria-roledescription="carrossel"
      aria-label="Eventos em cartaz"
    >
      <h1 className="sr-only">Bora Vê: ingressos para os eventos em cartaz</h1>

      <div className="wall__brick" aria-hidden="true" />
      <div className="wall__pool" aria-hidden="true" />

      <div className="wall__lamp" aria-hidden="true">
        <Lamp />
      </div>

      <div
        className="wall__stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStartX.current = null)}
      >
        {/* Em 3D, o cone fica atrás do cartaz iluminado e na frente dos cartazes laterais. */}
        <div
          key={flickerKey}
          className="wall__cone"
          data-flicker={flickerKey > 0}
          aria-hidden="true"
        />
        {offsets.map(({ event, index, offset, jump }) => {
          const distance = Math.abs(offset)
          const isActive = offset === 0
          return (
            <button
              key={event.id}
              type="button"
              className="wall__slot"
              data-active={isActive}
              data-distance={Math.min(distance, 3)}
              data-jump={jump}
              style={
                {
                  '--d': offset,
                  '--abs': distance,
                } as React.CSSProperties
              }
              tabIndex={isActive || distance === 1 ? 0 : -1}
              aria-hidden={distance > 2}
              aria-current={isActive ? 'true' : undefined}
              aria-label={
                isActive
                  ? `${event.title}, cartaz em destaque`
                  : `Ver ${event.title}`
              }
              onClick={() => {
                if (dragged.current) return
                if (isActive) {
                  document.getElementById('o-show')?.scrollIntoView()
                  return
                }
                go(index, offset > 0 ? 'next' : 'prev')
              }}
            >
              <Poster event={event} lit={isActive} eager={distance <= 1} />
            </button>
          )
        })}

      </div>

      <div className="wall__caption">
        <div aria-live="polite">
          <p className="wall__line tabular">
            <span className="sr-only">
              Cartaz {activeIndex + 1} de {total}:{' '}
            </span>
            <span className="wall__category">{active.category}</span>
            <span aria-hidden="true"> · </span>
            {formatShortDateTime(active.startsAt)}
            <span className="wall__venue">
              <span aria-hidden="true"> · </span>
              {active.venue.name}
            </span>
          </p>
          <h2 className="wall__title font-display">{active.title}</h2>
        </div>
        <p className="wall__tagline">{active.tagline}</p>
        <div className="wall__actions">
          <button
            type="button"
            className="wall__arrow"
            onClick={prev}
            aria-label="Cartaz anterior"
          >
            <ChevronLeft aria-hidden="true" strokeWidth={1.5} />
          </button>
          <a className="btn btn--primary" href="#ingressos">
            Garantir ingresso
          </a>
          <a className="btn btn--ghost" href="#o-show">
            Conhecer o show
            <ArrowDown aria-hidden="true" size={16} strokeWidth={1.75} />
          </a>
          <button
            type="button"
            className="wall__arrow"
            onClick={next}
            aria-label="Próximo cartaz"
          >
            <ChevronRight aria-hidden="true" strokeWidth={1.5} />
          </button>
        </div>
        <ol className="wall__dots" aria-label="Escolher cartaz">
          {events.map((event, index) => (
            <li key={event.id}>
              <button
                type="button"
                className="wall__dot"
                data-active={index === activeIndex}
                aria-label={`${event.title}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() =>
                  index !== activeIndex &&
                  go(index, index > activeIndex ? 'next' : 'prev')
                }
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
