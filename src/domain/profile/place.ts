/**
 * UFs e seus municípios, pela lista oficial do IBGE. O domínio não lê arquivo:
 * quem chama passa a lista (em `src/data/ibge-localidades.json`).
 */
export type Localities = Readonly<
  Record<string, { name: string; cities: ReadonlyArray<string> }>
>

/** A UF (sigla, ex.: `SP`) existe. */
export function isValidState(state: string, localities: Localities): boolean {
  return Object.hasOwn(localities, state)
}

/** A UF existe e a cidade (nome oficial do IBGE) pertence a ela. */
export function isValidPlace(
  state: string,
  city: string,
  localities: Localities,
): boolean {
  return (
    isValidState(state, localities) && localities[state].cities.includes(city)
  )
}
