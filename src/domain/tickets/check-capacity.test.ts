import { describe, expect, it } from 'vitest'
import { checkCapacity } from './check-capacity'

describe('checkCapacity', () => {
  it('permite comprar quando cabe na capacidade', () => {
    expect(checkCapacity({ capacity: 100, sold: 50, requested: 2 })).toBe(true)
  })

  it('permite comprar exatamente o último ingresso', () => {
    expect(checkCapacity({ capacity: 100, sold: 99, requested: 1 })).toBe(true)
  })

  it('bloqueia quando ultrapassa a capacidade', () => {
    expect(checkCapacity({ capacity: 100, sold: 99, requested: 2 })).toBe(false)
  })

  it('rejeita quantidade zero, negativa ou fracionada', () => {
    expect(() => checkCapacity({ capacity: 100, sold: 0, requested: 0 })).toThrow()
    expect(() => checkCapacity({ capacity: 100, sold: 0, requested: -1 })).toThrow()
    expect(() => checkCapacity({ capacity: 100, sold: 0, requested: 1.5 })).toThrow()
  })
})
