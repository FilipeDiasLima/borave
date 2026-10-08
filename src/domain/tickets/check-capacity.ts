type CheckCapacityInput = {
  capacity: number
  sold: number
  requested: number
}

/**
 * Invariante principal do Bora Vê: nunca vender mais ingressos do que a capacidade.
 * Função pura de domínio: sem banco, sem HTTP, sem React.
 */
export function checkCapacity({
  capacity,
  sold,
  requested,
}: CheckCapacityInput): boolean {
  if (!Number.isInteger(requested) || requested <= 0) {
    throw new Error('Quantidade de ingressos inválida')
  }
  return sold + requested <= capacity
}
