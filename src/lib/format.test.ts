import { describe, expect, it } from 'vitest'
import { formatBRL, formatShortDateTime, formatTime, todayIsoDate } from './format'

describe('formatBRL', () => {
  it('formata centavos em reais', () => {
    expect(formatBRL(8000)).toBe('R$ 80,00')
    expect(formatBRL(123456)).toBe('R$ 1.234,56')
  })

  it('recusa valores fracionados', () => {
    expect(() => formatBRL(10.5)).toThrow()
  })
})

describe('datas no fuso de São Paulo', () => {
  it('mostra hora cheia e quebrada', () => {
    expect(formatTime('2026-10-10T21:00:00-03:00')).toBe('21h')
    expect(formatTime('2026-10-23T20:30:00-03:00')).toBe('20h30')
  })

  it('monta a linha curta de data', () => {
    expect(formatShortDateTime('2026-10-10T21:00:00-03:00')).toBe('sáb, 10 out · 21h')
  })

  it('o dia de hoje vira à meia-noite de Brasília, não de UTC', () => {
    expect(todayIsoDate(new Date('2026-10-10T02:59:00Z'))).toBe('2026-10-09')
    expect(todayIsoDate(new Date('2026-10-10T03:00:00Z'))).toBe('2026-10-10')
  })
})
