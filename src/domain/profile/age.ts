/**
 * Data de calendário no formato ISO `AAAA-MM-DD` (sem hora nem fuso), como vem
 * do `<input type="date">` e como a pessoa pensa no próprio aniversário.
 */
export type IsoDate = string

type CalendarDate = { year: number; month: number; day: number }

function parseIsoDate(date: IsoDate): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return null

  const [year, month, day] = match.slice(1).map(Number)
  // Recusa datas que não existem no calendário (ex.: 2023-02-30).
  const utc = new Date(Date.UTC(year, month - 1, day))
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null
  }
  return { year, month, day }
}

/** `AAAA-MM-DD` que existe no calendário. */
export function isValidIsoDate(date: IsoDate): boolean {
  return parseIsoDate(date) !== null
}

/** `date` depois de `today` (ambas `AAAA-MM-DD`, que comparam certo como texto). */
export function isFutureDate(date: IsoDate, today: IsoDate): boolean {
  return date > today
}

/**
 * Idade completa em anos no dia `today`. Faz aniversário no próprio dia do
 * aniversário; um dia antes ainda tem a idade anterior.
 * Nascimento no futuro (ou data inválida) é erro.
 */
export function ageAt(birthDate: IsoDate, today: IsoDate): number {
  const birth = parseIsoDate(birthDate)
  const now = parseIsoDate(today)
  if (!birth || !now) {
    throw new Error('Data inválida')
  }
  if (isFutureDate(birthDate, today)) {
    throw new Error('Data de nascimento no futuro')
  }

  const hadBirthdayThisYear =
    now.month > birth.month ||
    (now.month === birth.month && now.day >= birth.day)
  return now.year - birth.year - (hadBirthdayThisYear ? 0 : 1)
}
