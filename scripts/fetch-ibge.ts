// Baixa a lista oficial de UFs e municípios da API de localidades do IBGE e salva
// em src/data/ibge-localidades.json. O app só lê esse JSON versionado: ele nunca
// chama o IBGE em tempo de execução. Rode `pnpm ibge:fetch` para atualizar.
import { writeFile } from 'node:fs/promises'

const API = 'https://servicodados.ibge.gov.br/api/v1/localidades'
const OUTPUT = new URL('../src/data/ibge-localidades.json', import.meta.url)

type IbgeState = { sigla: string; nome: string }
type IbgeCity = { 'municipio-nome': string; 'UF-sigla': string }

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`)
  if (!response.ok) {
    throw new Error(`IBGE respondeu ${response.status} em ${path}`)
  }
  return (await response.json()) as T
}

const byName = (a: string, b: string) => a.localeCompare(b, 'pt-BR')

const [states, cities] = await Promise.all([
  get<Array<IbgeState>>('/estados'),
  // `view=nivelado` traz a UF em cada município, sem depender da micro/mesorregião
  // (que vem nula em municípios recentes).
  get<Array<IbgeCity>>('/municipios?view=nivelado'),
])

const localities: Record<string, { name: string; cities: Array<string> }> = {}
for (const state of [...states].sort((a, b) => byName(a.sigla, b.sigla))) {
  localities[state.sigla] = { name: state.nome, cities: [] }
}
for (const city of cities) {
  const state = localities[city['UF-sigla']] as
    (typeof localities)[string] | undefined
  if (!state) {
    throw new Error(`Município ${city['municipio-nome']} sem UF conhecida`)
  }
  state.cities.push(city['municipio-nome'])
}
for (const state of Object.values(localities)) {
  state.cities.sort(byName)
}

await writeFile(OUTPUT, `${JSON.stringify(localities, null, 2)}\n`)
console.log(
  `${Object.keys(localities).length} UFs e ${cities.length} municípios salvos em ${OUTPUT.pathname}`,
)
