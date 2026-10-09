import { describe, expect, it } from 'vitest'
import { ageAt, isValidIsoDate } from './age'

describe('ageAt', () => {
  it('faz aniversário no próprio dia', () => {
    expect(ageAt('2000-10-09', '2026-10-09')).toBe(26)
  })

  it('um dia antes do aniversário ainda tem a idade anterior', () => {
    expect(ageAt('2000-10-09', '2026-10-08')).toBe(25)
  })

  it('conta o aniversário de mês anterior', () => {
    expect(ageAt('2000-03-15', '2026-10-08')).toBe(26)
  })

  it('nascido hoje tem zero anos', () => {
    expect(ageAt('2026-10-09', '2026-10-09')).toBe(0)
  })

  it('quem nasceu em 29/02 só faz aniversário em 01/03 em ano não bissexto', () => {
    expect(ageAt('2004-02-29', '2025-02-28')).toBe(20)
    expect(ageAt('2004-02-29', '2025-03-01')).toBe(21)
  })

  it('rejeita nascimento no futuro', () => {
    expect(() => ageAt('2026-10-10', '2026-10-09')).toThrow(
      'Data de nascimento no futuro',
    )
  })

  it('rejeita data que não existe', () => {
    expect(() => ageAt('2023-02-30', '2026-10-09')).toThrow('Data inválida')
  })
})

describe('isValidIsoDate', () => {
  it('aceita AAAA-MM-DD que existe', () => {
    expect(isValidIsoDate('2024-02-29')).toBe(true)
  })

  it.each(['2023-02-29', '2024-13-01', '09/10/2000', '2000-1-1', ''])(
    'rejeita %j',
    (date) => {
      expect(isValidIsoDate(date)).toBe(false)
    },
  )
})
