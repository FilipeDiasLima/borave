const TIME_ZONE = 'America/Sao_Paulo'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Valores do Bora Vê são sempre inteiros em centavos (CLAUDE.md > Regras). */
export function formatBRL(cents: number): string {
  if (!Number.isInteger(cents)) {
    throw new Error('Valor monetário deve ser inteiro, em centavos')
  }
  return brl.format(cents / 100)
}

const parts = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, ...options }).format(
    new Date(iso),
  )

/** "10" */
export const formatDay = (iso: string) => parts(iso, { day: '2-digit' })

/** "out" */
export const formatMonthShort = (iso: string) =>
  parts(iso, { month: 'short' }).replace('.', '')

/** "sábado" */
export const formatWeekday = (iso: string) => parts(iso, { weekday: 'long' })

/** "21h" ou "20h30" */
export function formatTime(iso: string): string {
  const [hour, minute] = parts(iso, { hour: '2-digit', minute: '2-digit', hour12: false }).split(':')
  return minute === '00' ? `${hour}h` : `${hour}h${minute}`
}

/** "sáb, 10 out · 21h" */
export function formatShortDateTime(iso: string): string {
  const weekday = parts(iso, { weekday: 'short' }).replace('.', '')
  return `${weekday}, ${formatDay(iso)} ${formatMonthShort(iso)} · ${formatTime(iso)}`
}

const isoDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Data de hoje no Brasil, em `AAAA-MM-DD` (o servidor roda em UTC). */
export const todayIsoDate = (now: Date = new Date()) => isoDate.format(now)
