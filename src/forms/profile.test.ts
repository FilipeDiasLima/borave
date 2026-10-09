import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ProfileFormValues } from './profile'
import { profileEditSchema, profileSchema } from './profile'

const valid: ProfileFormValues = {
  firstName: 'Ana',
  lastName: 'Souza',
  birthDate: '1998-04-12',
  cpf: '529.982.247-25',
  state: 'MG',
  city: 'Belo Horizonte',
}

/** Mensagens de erro por campo. */
function errors(result: {
  success: boolean
  error?: { issues: Array<{ path: Array<PropertyKey>; message: string }> }
}) {
  const byField: Record<string, Array<string>> = {}
  for (const issue of result.error?.issues ?? []) {
    const field = String(issue.path[0])
    byField[field] = [...(byField[field] ?? []), issue.message]
  }
  return byField
}

beforeEach(() => {
  // 9/10/2026 às 22h em Brasília (já é dia 10 em UTC).
  vi.useFakeTimers({ now: new Date('2026-10-10T01:00:00Z') })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('profileSchema', () => {
  it('aceita um cadastro válido e guarda o CPF só com dígitos', () => {
    const result = profileSchema.safeParse(valid)
    expect(result.success).toBe(true)
    expect(result.data?.cpf).toBe('52998224725')
  })

  it('aceita CPF sem máscara e tira espaços dos nomes', () => {
    const result = profileSchema.safeParse({
      ...valid,
      firstName: '  Ana ',
      cpf: '52998224725',
    })
    expect(result.data).toMatchObject({ firstName: 'Ana', cpf: '52998224725' })
  })

  it.each<[keyof ProfileFormValues, string, string]>([
    ['firstName', '', 'Informe seu nome.'],
    ['firstName', '   ', 'Informe seu nome.'],
    ['firstName', 'a'.repeat(81), 'O nome pode ter até 80 caracteres.'],
    ['lastName', '', 'Informe seu sobrenome.'],
    ['lastName', 'a'.repeat(81), 'O sobrenome pode ter até 80 caracteres.'],
    ['birthDate', '', 'Informe sua data de nascimento.'],
    ['birthDate', '2023-02-30', 'Data de nascimento inválida.'],
    ['birthDate', '12/04/1998', 'Data de nascimento inválida.'],
    [
      'birthDate',
      '2026-10-10',
      'A data de nascimento não pode estar no futuro.',
    ],
    ['cpf', '', 'Informe seu CPF.'],
    ['cpf', '529.982.247-26', 'CPF inválido. Confira os números.'],
    ['cpf', '111.111.111-11', 'CPF inválido. Confira os números.'],
    ['state', '', 'Selecione um estado.'],
    ['state', 'XX', 'Selecione um estado.'],
    ['city', '', 'Selecione uma cidade.'],
  ])('rejeita %s = %j com "%s"', (field, value, message) => {
    const result = profileSchema.safeParse({ ...valid, [field]: value })
    expect(errors(result)).toEqual({ [field]: [message] })
  })

  it('aceita quem nasceu hoje no fuso de Brasília', () => {
    expect(
      profileSchema.safeParse({ ...valid, birthDate: '2026-10-09' }).success,
    ).toBe(true)
  })

  it('rejeita cidade de outra UF', () => {
    const result = profileSchema.safeParse({ ...valid, state: 'SP' })
    expect(errors(result)).toEqual({
      city: ['Essa cidade não pertence ao estado escolhido.'],
    })
  })

  it('aponta a cidade de outra UF mesmo com erro em outro campo', () => {
    const result = profileSchema.safeParse({ ...valid, state: 'SP', cpf: '' })
    expect(errors(result)).toEqual({
      cpf: ['Informe seu CPF.'],
      city: ['Essa cidade não pertence ao estado escolhido.'],
    })
  })

  it('não acusa cidade de outra UF quando a UF é inválida', () => {
    const result = profileSchema.safeParse({ ...valid, state: 'XX' })
    expect(errors(result)).toEqual({ state: ['Selecione um estado.'] })
  })
})

describe('profileEditSchema', () => {
  const { cpf: _cpf, ...editable } = valid

  it('aceita a edição sem CPF', () => {
    expect(profileEditSchema.safeParse(editable).success).toBe(true)
  })

  it('não deixa o CPF passar adiante', () => {
    const result = profileEditSchema.safeParse({
      ...editable,
      cpf: '123.456.789-09',
    })
    expect(result.data).not.toHaveProperty('cpf')
  })

  it('continua validando cidade e UF', () => {
    const result = profileEditSchema.safeParse({
      ...editable,
      city: 'Campinas',
    })
    expect(errors(result)).toEqual({
      city: ['Essa cidade não pertence ao estado escolhido.'],
    })
  })
})
