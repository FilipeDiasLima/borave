import { featuredEvents } from './featured-events'
import { moreEvents } from './more-events'

/** Todos os eventos (de exemplo), em ordem de data. Os em destaque também estão aqui. */
export const allEvents = [...featuredEvents, ...moreEvents].sort(
  (a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt),
)
