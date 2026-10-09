import { describe, expect, it } from 'vitest'
import { isValidPlace } from '#/domain/profile/place'
import { localities } from './localities'

// O JSON vem do IBGE (pnpm ibge:fetch). Se a geração quebrar, esses testes avisam.
describe('localidades do IBGE', () => {
  it('tem as 26 UFs e o DF', () => {
    expect(Object.keys(localities)).toHaveLength(27)
    expect(localities.DF.name).toBe('Distrito Federal')
  })

  it.each(Object.entries(localities))(
    '%s tem municípios sem repetição',
    (_, state) => {
      expect(state.cities.length).toBeGreaterThan(0)
      expect(new Set(state.cities).size).toBe(state.cities.length)
    },
  )

  it('tem pelo menos 5.570 municípios', () => {
    const total = Object.values(localities).reduce(
      (sum, s) => sum + s.cities.length,
      0,
    )
    expect(total).toBeGreaterThanOrEqual(5570)
  })

  it('reconhece cidades homônimas em UFs diferentes', () => {
    expect(isValidPlace('MG', 'Bom Jesus', localities)).toBe(false)
    expect(isValidPlace('PI', 'Bom Jesus', localities)).toBe(true)
    expect(isValidPlace('RS', 'Bom Jesus', localities)).toBe(true)
  })
})
