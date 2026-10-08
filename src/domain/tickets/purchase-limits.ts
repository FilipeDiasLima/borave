import { checkCapacity } from './check-capacity'

type PurchaseLimitInput = {
  capacity: number
  sold: number
  perOrderLimit: number
}

/**
 * Quantos ingressos de um setor ainda cabem num único pedido.
 * Respeita a invariante principal (nunca passar da capacidade) e o limite por pedido.
 */
export function maxPurchasable({
  capacity,
  sold,
  perOrderLimit,
}: PurchaseLimitInput): number {
  if (!Number.isInteger(perOrderLimit) || perOrderLimit <= 0) {
    throw new Error('Limite por pedido inválido')
  }

  let max = 0
  while (
    max < perOrderLimit &&
    checkCapacity({ capacity, sold, requested: max + 1 })
  ) {
    max += 1
  }
  return max
}

/** Esgotado quando não cabe nem mais um ingresso. */
export function isSoldOut({ capacity, sold }: { capacity: number; sold: number }) {
  return !checkCapacity({ capacity, sold, requested: 1 })
}
