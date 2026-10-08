import { describe, expect, it } from 'vitest'
import { allEvents } from './all-events'
import { featuredEvents } from './featured-events'

// Os dados de exemplo alimentam a UI e os testes de capacidade: eles também
// precisam respeitar as regras do domínio (CLAUDE.md > Regras).
describe('dados de exemplo', () => {
  it('tem 21 eventos com ids únicos', () => {
    expect(allEvents).toHaveLength(21)
    expect(new Set(allEvents.map((e) => e.id)).size).toBe(allEvents.length)
  })

  it('só os eventos do muro são destaque', () => {
    const highlighted = allEvents.filter((e) => e.highlight)
    expect(highlighted.map((e) => e.id).sort()).toEqual(
      featuredEvents.map((e) => e.id).sort(),
    )
  })

  it.each(allEvents.map((e) => [e.id, e] as const))('%s respeita as regras', (_, event) => {
    expect(event.tiers.length).toBeGreaterThan(0)
    expect(Date.parse(event.doorsOpenAt)).toBeLessThan(Date.parse(event.startsAt))
    for (const tier of event.tiers) {
      expect(Number.isInteger(tier.priceCents)).toBe(true)
      expect(tier.priceCents).toBeGreaterThan(0)
      expect(tier.sold).toBeLessThanOrEqual(tier.capacity)
    }
  })
})
