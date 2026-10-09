import { describe, expect, it } from 'vitest'
import { isValidCpf, maskCpf, normalizeCpf } from './cpf'

describe('isValidCpf', () => {
  it('aceita CPF válido com máscara', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true)
  })

  it('aceita CPF válido sem máscara', () => {
    expect(isValidCpf('52998224725')).toBe(true)
  })

  it('aceita CPF cujo dígito verificador é zero', () => {
    expect(isValidCpf('123.456.789-09')).toBe(true)
  })

  it('rejeita o primeiro dígito verificador errado', () => {
    expect(isValidCpf('529.982.247-35')).toBe(false)
  })

  it('rejeita o segundo dígito verificador errado', () => {
    expect(isValidCpf('529.982.247-26')).toBe(false)
  })

  it.each(['000.000.000-00', '111.111.111-11', '99999999999'])(
    'rejeita a sequência repetida %s',
    (cpf) => {
      expect(isValidCpf(cpf)).toBe(false)
    },
  )

  it.each([
    '',
    '529.982.247-2',
    '529982247250',
    '529.982.247/25',
    'abc.def.ghi-jk',
  ])('rejeita formato inválido %j', (cpf) => {
    expect(isValidCpf(cpf)).toBe(false)
  })
})

describe('normalizeCpf', () => {
  it('deixa só os dígitos', () => {
    expect(normalizeCpf('529.982.247-25')).toBe('52998224725')
  })

  it('não muda CPF já sem máscara', () => {
    expect(normalizeCpf('52998224725')).toBe('52998224725')
  })
})

describe('maskCpf', () => {
  it('esconde o começo e os dígitos verificadores', () => {
    expect(maskCpf('123.456.789-09')).toBe('***.456.789-**')
  })

  it('aceita CPF sem máscara', () => {
    expect(maskCpf('12345678909')).toBe('***.456.789-**')
  })

  it('rejeita CPF sem 11 dígitos', () => {
    expect(() => maskCpf('1234')).toThrow()
  })
})
