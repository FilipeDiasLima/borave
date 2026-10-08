import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

import { PER_ORDER_LIMIT } from '#/data/featured-events'
import type { FeaturedEvent, TicketTier } from '#/data/featured-events'
import { isSoldOut, maxPurchasable } from '#/domain/tickets/purchase-limits'
import { formatBRL, formatShortDateTime } from '#/lib/format'

/** Abaixo disso, o canhoto avisa que está acabando. */
const LOW_STOCK = 10

function availabilityLabel(tier: TicketTier): string {
  const remaining = tier.capacity - tier.sold
  if (isSoldOut(tier)) return 'Esgotado'
  if (remaining <= LOW_STOCK) {
    return remaining === 1 ? 'Último ingresso' : `Últimos ${remaining}`
  }
  return 'Disponível'
}

type Quantities = Record<string, number>

/**
 * Bilheteria do evento selecionado. Escolher setor e quantidade já funciona;
 * finalizar a compra ainda não existe (próxima etapa do projeto).
 */
type TicketBoothProps = {
  event: FeaturedEvent
  /** Prefixo dos ids, para a bilheteria poder aparecer também dentro do modal. */
  idPrefix?: string
}

export function TicketBooth({ event, idPrefix = '' }: TicketBoothProps) {
  const [quantities, setQuantities] = useState<Quantities>({})

  const limitFor = (tier: TicketTier) =>
    maxPurchasable({
      capacity: tier.capacity,
      sold: tier.sold,
      perOrderLimit: PER_ORDER_LIMIT,
    })

  const change = (tier: TicketTier, delta: number) => {
    setQuantities((current) => {
      const nextValue = Math.min(
        limitFor(tier),
        Math.max(0, (current[tier.id] ?? 0) + delta),
      )
      return { ...current, [tier.id]: nextValue }
    })
  }

  const selected = event.tiers
    .map((tier) => ({ tier, quantity: quantities[tier.id] ?? 0 }))
    .filter(({ quantity }) => quantity > 0)
  const totalCents = selected.reduce(
    (sum, { tier, quantity }) => sum + tier.priceCents * quantity,
    0,
  )
  const ticketCount = selected.reduce((sum, { quantity }) => sum + quantity, 0)

  return (
    <section
      id={`${idPrefix}ingressos`}
      className="booth"
      aria-labelledby={`${idPrefix}booth-title`}
    >
      <div className="booth__inner">
        <header className="booth__head">
          <h2
            id={`${idPrefix}booth-title`}
            className="booth__title font-display"
          >
            Ingressos
          </h2>
          <p className="booth__event tabular">
            {event.title} · {formatShortDateTime(event.startsAt)} ·{' '}
            {event.venue.name}
          </p>
        </header>

        <div className="booth__grid">
          <ul className="booth__tiers">
            {event.tiers.map((tier) => {
              const quantity = quantities[tier.id] ?? 0
              const limit = limitFor(tier)
              const soldOut = isSoldOut(tier)
              const labelId = `${idPrefix}tier-${tier.id}`
              return (
                <li
                  key={tier.id}
                  className="stub"
                  data-sold-out={soldOut}
                  aria-labelledby={labelId}
                >
                  <div className="stub__main">
                    <p id={labelId} className="stub__name font-display">
                      {tier.name}
                    </p>
                    <p className="stub__description">{tier.description}</p>
                    <p
                      className="stub__availability"
                      data-low={!soldOut && limit < PER_ORDER_LIMIT}
                    >
                      {availabilityLabel(tier)}
                    </p>
                  </div>
                  <div className="stub__side">
                    <p className="stub__price font-display tabular">
                      {formatBRL(tier.priceCents)}
                    </p>
                    <div
                      className="stepper"
                      role="group"
                      aria-label={`Quantidade de ${tier.name}`}
                    >
                      <button
                        type="button"
                        className="stepper__btn"
                        onClick={() => change(tier, -1)}
                        disabled={quantity === 0}
                        aria-label={`Remover um ingresso ${tier.name}`}
                      >
                        <Minus aria-hidden="true" size={16} strokeWidth={2} />
                      </button>
                      <output
                        className="stepper__value tabular"
                        aria-live="polite"
                      >
                        {quantity}
                      </output>
                      <button
                        type="button"
                        className="stepper__btn"
                        onClick={() => change(tier, 1)}
                        disabled={quantity >= limit}
                        aria-label={`Adicionar um ingresso ${tier.name}`}
                      >
                        <Plus aria-hidden="true" size={16} strokeWidth={2} />
                      </button>
                    </div>
                    {!soldOut && quantity > 0 && quantity >= limit && (
                      <p className="stub__limit">
                        {limit === PER_ORDER_LIMIT
                          ? `Máximo de ${PER_ORDER_LIMIT} por pedido`
                          : 'Não há mais lugares neste setor'}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          <aside className="summary" aria-label="Resumo do pedido">
            <h3 className="summary__title font-display">Seu pedido</h3>
            {selected.length === 0 ? (
              <p className="summary__empty">
                Escolha um setor e a quantidade de ingressos para ver o total.
              </p>
            ) : (
              <ul className="summary__lines">
                {selected.map(({ tier, quantity }) => (
                  <li key={tier.id} className="summary__line tabular">
                    <span>
                      {quantity} × {tier.name}
                    </span>
                    <span>{formatBRL(tier.priceCents * quantity)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="summary__total tabular">
              <span className="summary__total-label">
                Total
                {ticketCount > 0
                  ? ` · ${ticketCount} ${ticketCount === 1 ? 'ingresso' : 'ingressos'}`
                  : ''}
              </span>
              <span className="summary__total-value font-display">
                {formatBRL(totalCents)}
              </span>
            </p>
            <button
              type="button"
              className="btn btn--paper summary__cta"
              disabled
            >
              Finalizar compra
            </button>
            <p className="summary__note">
              A finalização da compra chega na próxima etapa do Bora Vê. Por
              enquanto, você já pode montar o seu pedido.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
