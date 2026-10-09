import * as z from 'zod'
import { localities } from '#/data/localities'
import { isFutureDate, isValidIsoDate } from '#/domain/profile/age'
import { isValidCpf, normalizeCpf } from '#/domain/profile/cpf'
import { isValidPlace, isValidState } from '#/domain/profile/place'
import { todayIsoDate } from '#/lib/format'

const NAME_MAX = 80

// Uma mensagem por campo: cada checagem só julga o que a anterior deixou passar
// (vazio fica com "Informe…"). Sem `abort`, que faria o Zod pular a checagem
// de cidade × UF quando outro campo tem erro.
const filled = (check: (value: string) => boolean) => (value: string) =>
  value === '' || check(value)

const name = (missing: string, tooLong: string) =>
  z.string().trim().min(1, missing).max(NAME_MAX, tooLong)

const profileFields = z.object({
  firstName: name(
    'Informe seu nome.',
    `O nome pode ter até ${NAME_MAX} caracteres.`,
  ),
  lastName: name(
    'Informe seu sobrenome.',
    `O sobrenome pode ter até ${NAME_MAX} caracteres.`,
  ),
  birthDate: z
    .string()
    .min(1, 'Informe sua data de nascimento.')
    .refine(filled(isValidIsoDate), 'Data de nascimento inválida.')
    .refine(
      (date) => !isValidIsoDate(date) || !isFutureDate(date, todayIsoDate()),
      'A data de nascimento não pode estar no futuro.',
    ),
  cpf: z
    .string()
    .trim()
    .min(1, 'Informe seu CPF.')
    .refine(filled(isValidCpf), 'CPF inválido. Confira os números.')
    // Sai só com os dígitos: é assim que o backend guarda.
    .transform(normalizeCpf),
  state: z
    .string()
    .refine((state) => isValidState(state, localities), 'Selecione um estado.'),
  city: z.string().trim().min(1, 'Selecione uma cidade.'),
})

type Place = { state: string; city: string }

/**
 * A cidade precisa ser da UF escolhida. Roda mesmo com erro em outros campos
 * (o Zod pularia por padrão), desde que UF e cidade estejam preenchidas.
 */
function cityBelongsToState<T extends z.ZodType<Place>>(schema: T) {
  return schema.refine(
    ({ state, city }) => isValidPlace(state, city, localities),
    {
      error: 'Essa cidade não pertence ao estado escolhido.',
      path: ['city'],
      when: ({ issues }) =>
        !issues.some(
          ({ path }) => path?.[0] === 'state' || path?.[0] === 'city',
        ),
    },
  )
}

/** Concluir cadastro: todos os campos. */
export const profileSchema = cityBelongsToState(profileFields)

/** Editar perfil: o CPF não é editável, então fica de fora. */
export const profileEditSchema = cityBelongsToState(
  profileFields.omit({ cpf: true }),
)

/** O que o formulário preenche. */
export type ProfileFormValues = z.input<typeof profileSchema>
/** O que sai validado (CPF só com dígitos). */
export type Profile = z.output<typeof profileSchema>

export type ProfileEditFormValues = z.input<typeof profileEditSchema>
export type ProfileEdit = z.output<typeof profileEditSchema>
