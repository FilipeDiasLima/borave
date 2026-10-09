import type { Localities } from '#/domain/profile/place'
import ibgeLocalities from './ibge-localidades.json'

/**
 * UFs e municípios oficiais do IBGE. O JSON é versionado e gerado por
 * `pnpm ibge:fetch` (scripts/fetch-ibge.ts): o app não chama o IBGE.
 */
export const localities: Localities = ibgeLocalities
