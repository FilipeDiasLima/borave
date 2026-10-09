import { describe, expect, it } from 'vitest'
import type { Localities } from './place'
import { isValidPlace, isValidState } from './place'

const localities: Localities = {
  MG: { name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia'] },
  SP: { name: 'São Paulo', cities: ['Campinas', 'São Paulo'] },
}

describe('isValidState', () => {
  it('aceita UF da lista', () => {
    expect(isValidState('SP', localities)).toBe(true)
  })

  it.each(['XX', 'sp', '', 'toString'])('rejeita %j', (state) => {
    expect(isValidState(state, localities)).toBe(false)
  })
})

describe('isValidPlace', () => {
  it('aceita cidade da própria UF', () => {
    expect(isValidPlace('MG', 'Uberlândia', localities)).toBe(true)
  })

  it('rejeita cidade de outra UF', () => {
    expect(isValidPlace('SP', 'Belo Horizonte', localities)).toBe(false)
  })

  it('rejeita cidade que não existe', () => {
    expect(isValidPlace('SP', 'Gotham', localities)).toBe(false)
  })

  it('rejeita UF que não existe', () => {
    expect(isValidPlace('XX', 'São Paulo', localities)).toBe(false)
  })
})
