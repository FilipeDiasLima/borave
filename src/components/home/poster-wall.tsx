import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Transition } from 'motion/react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/motion-primitives/carousel'
import { HIGHLIGHT_LABEL } from '#/data/featured-events'
import type { FeaturedEvent } from '#/data/featured-events'
import { formatShortDateTime } from '#/lib/format'
import { Lamp } from './lamp'
import { Poster } from './poster'

type PosterWallProps = {
  events: Array<FeaturedEvent>
  activeIndex: number
  onChange: (index: number) => void
  /** Total de eventos na listagem completa e como abri-la (a partir de um botão). */
  allEventsCount: number
  onOpenAll: (from: HTMLElement) => void
}

/**
 * O trilho do Carousel mostra 5 células no desktop e 3 no celular (ver `w-1/5` e
 * `w-1/3` abaixo); o cartaz aceso é sempre a célula do meio.
 */
const DESKTOP_QUERY = '(min-width: 721px)'
const cellsFor = (desktop: boolean) => (desktop ? 5 : 3)

/** Três cópias da lista: o usuário anda na do meio e nunca chega ao fim do trilho. */
const COPIES = 3

const SLIDE: Transition = { duration: 0.78, ease: [0.16, 1, 0.3, 1] }
const INSTANT: Transition = { duration: 0 }

const mod = (value: number, total: number) => ((value % total) + total) % total

export function PosterWall({
  events,
  activeIndex,
  onChange,
  allEventsCount,
  onOpenAll,
}: PosterWallProps) {
  const total = events.length
  const track = Array.from({ length: COPIES }, () => events).flat()

  // Posição do cartaz aceso no trilho; começa no evento ativo, na cópia do meio.
  const [lit, setLit] = useState(total + activeIndex)
  const [desktop, setDesktop] = useState(true)
  // Instantâneo no primeiro paint (o Carousel ainda mede as células) e nos saltos de volta.
  const [instant, setInstant] = useState(true)
  const [flickerKey, setFlickerKey] = useState(0)
  // Antes da hidratação, o CSS posiciona o trilho; depois, quem manda é o Carousel.
  const [ready, setReady] = useState(false)
  useLayoutEffect(() => setReady(true), [])
  // Onde o ponteiro desceu: um clique que termina um arrasto não conta como clique.
  const pressX = useRef<number | null>(null)
  const heroRef = useRef<HTMLElement>(null)

  // O Carousel indexa pela primeira célula visível; o aceso fica no meio da janela.
  const litOffset = (cellsFor(desktop) - 1) / 2
  const index = lit - litOffset
  const litEvent = mod(lit, total)
  const active = events[litEvent]

  const move = (delta: number) => {
    if (delta === 0) return
    setInstant(false)
    setLit((current) => current + delta)
  }
  const next = () => move(1)
  const prev = () => move(-1)

  useEffect(() => {
    const timer = window.setTimeout(() => setInstant(false), 250)
    return () => window.clearTimeout(timer)
  }, [])

  // Desktop e celular mostram quantidades diferentes de células.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const sync = () => {
      setInstant(true)
      setDesktop(query.matches)
    }
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  // Avisa a página e pisca a lâmpada quando o cartaz aceso muda.
  useEffect(() => {
    if (litEvent !== activeIndex) {
      onChange(litEvent)
      setFlickerKey((key) => key + 1)
    }
  }, [litEvent, activeIndex, onChange])

  // Carrossel infinito: depois do deslize, se o cartaz aceso saiu da cópia do meio,
  // volta para o mesmo cartaz na cópia do meio sem animação (ninguém vê o salto).
  useEffect(() => {
    if (lit >= total && lit < total * 2) return
    const timer = window.setTimeout(() => {
      setInstant(true)
      setLit(total + mod(lit, total))
    }, SLIDE.duration! * 1000)
    return () => window.clearTimeout(timer)
  }, [lit, total])

  // Setas do teclado trocam de cartaz quando ninguém está digitando.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Com a listagem aberta por cima, as setas não mexem no muro.
      if (document.documentElement.dataset.overlay) return
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
        return
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
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / hero.offsetHeight),
      )
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

  return (
    <section
      ref={heroRef}
      id="em-cartaz"
      className="wall"
      aria-roledescription="carrossel"
      aria-label="Eventos em cartaz"
    >
      <h1 className="sr-only">Destaques da semana e do mês no Bora Vê</h1>

      <div className="wall__brick" aria-hidden="true" />
      <div className="wall__pool" aria-hidden="true" />

      {/* O cone fica na frente dos cartazes: a luz cai sobre o papel. */}
      <div
        key={flickerKey}
        className="wall__cone"
        data-flicker={flickerKey > 0}
        aria-hidden="true"
      />
      <div className="wall__lamp" aria-hidden="true">
        <Lamp />
      </div>

      <div
        className="wall__stage"
        data-instant={instant}
        data-ready={ready}
        onPointerDownCapture={(e) => (pressX.current = e.clientX)}
      >
        <Carousel
          className="wall__carousel"
          index={index}
          onIndexChange={(value) => {
            setInstant(false)
            setLit(value + litOffset)
          }}
        >
          <CarouselContent
            className="wall__track"
            transition={instant ? INSTANT : SLIDE}
          >
            {track.map((event, position) => {
              // Distância real no trilho: decide foco, leitor de tela e clique.
              const offset = position - lit
              // Distância circular (por evento): decide o visual. Como a volta do
              // carrossel infinito salta exatamente uma cópia, todo cartaz mantém o
              // mesmo visual antes e depois do salto, e nada pisca.
              let visual = mod(offset, total)
              if (visual > total / 2) visual -= total
              const distance = Math.min(Math.abs(visual), 3)
              const inView = Math.abs(offset) <= 1
              const isActive = offset === 0
              return (
                <CarouselItem
                  key={`${event.id}-${position}`}
                  className={`wall__item wall__item--d${distance} w-1/3 overflow-visible min-[721px]:w-1/5`}
                >
                  <button
                    type="button"
                    className="wall__slot"
                    data-active={isActive}
                    data-distance={distance}
                    style={
                      {
                        '--d': Math.max(-3, Math.min(3, visual)),
                        '--abs': distance,
                      } as React.CSSProperties
                    }
                    tabIndex={inView ? 0 : -1}
                    aria-hidden={inView ? undefined : true}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={
                      isActive
                        ? `${event.title}, cartaz em destaque`
                        : `Ver ${event.title}`
                    }
                    onClick={(e) => {
                      // Ignora o clique que encerra um arrasto.
                      const start = pressX.current
                      if (start !== null && Math.abs(e.clientX - start) > 8)
                        return
                      if (isActive) {
                        document.getElementById('o-show')?.scrollIntoView()
                        return
                      }
                      move(offset)
                    }}
                  >
                    <Poster event={event} lit={visual === 0} eager />
                  </button>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="wall__caption">
        <div aria-live="polite">
          <p className="wall__line tabular">
            <span className="sr-only">
              Cartaz {litEvent + 1} de {total}:{' '}
            </span>
            {active.highlight && (
              <>
                <span className="wall__highlight">
                  {HIGHLIGHT_LABEL[active.highlight]}
                </span>
                <span aria-hidden="true"> · </span>
              </>
            )}
            <span className="wall__category-group">
              <span className="wall__category">{active.category}</span>
              <span aria-hidden="true"> · </span>
            </span>
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
          {events.map((event, dot) => (
            <li key={event.id}>
              <button
                type="button"
                className="wall__dot"
                data-active={dot === litEvent}
                aria-label={`${event.title}`}
                aria-current={dot === litEvent ? 'true' : undefined}
                onClick={() => {
                  // Caminho mais curto no círculo de cartazes.
                  let delta = mod(dot - litEvent, total)
                  if (delta > total / 2) delta -= total
                  move(delta)
                }}
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="wall__all"
          onClick={(e) => onOpenAll(e.currentTarget)}
        >
          Ver todos os {allEventsCount} eventos
          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} />
        </button>
      </div>
    </section>
  )
}
