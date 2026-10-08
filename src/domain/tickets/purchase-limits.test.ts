import { describe, expect, it } from 'vitest'
import { isSoldOut, maxPurchasable } from './purchase-limits'

describe('maxPurchasable', () => {
  it('limita pelo pedido quando sobra muito lugar', () => {
    expect(maxPurchasable({ capacity: 800, sold: 100, perOrderLimit: 6 })).toBe(6)
  })

  it('limita pelo que resta quando sobra pouco lugar', () => {
    expect(maxPurchasable({ capacity: 100, sold: 97, perOrderLimit: 6 })).toBe(3)
  })

  it('é zero quando o setor está esgotado', () => {
    expect(maxPurchasable({ capacity: 300, sold: 300, perOrderLimit: 6 })).toBe(0)
  })

  it('nunca passa da capacidade mesmo com dados inconsistentes', () => {
    expect(maxPurchasable({ capacity: 100, sold: 120, perOrderLimit: 6 })).toBe(0)
  })

  it('rejeita limite por pedido inválido', () => {
    expect(() => maxPurchasable({ capacity: 10, sold: 0, perOrderLimit: 0 })).toThrow()
  })
})

describe('isSoldOut', () => {
  it('detecta setor esgotado', () => {
    expect(isSoldOut({ capacity: 60, sold: 60 })).toBe(true)
  })

  it('não marca esgotado quando resta um lugar', () => {
    expect(isSoldOut({ capacity: 60, sold: 59 })).toBe(false)
  })
})
