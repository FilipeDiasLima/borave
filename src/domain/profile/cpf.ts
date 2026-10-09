const CPF_LENGTH = 11

/** Só os dígitos do CPF: `123.456.789-09` → `12345678909`. */
export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

/** Dígito verificador do CPF para os `digits` informados (9 ou 10). */
function checkDigit(digits: string): number {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    sum += Number(digits[i]) * (digits.length + 1 - i)
  }
  const rest = (sum * 10) % 11
  return rest === 10 ? 0 : rest
}

/**
 * CPF válido pelos dígitos verificadores. Aceita com ou sem máscara
 * (`123.456.789-09` ou `12345678909`) e rejeita sequências repetidas
 * (`111.111.111-11`), que passam no cálculo mas não existem.
 */
export function isValidCpf(cpf: string): boolean {
  if (!/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/.test(cpf.trim())) return false

  const digits = normalizeCpf(cpf)
  if (/^(\d)\1+$/.test(digits)) return false

  return (
    checkDigit(digits.slice(0, 9)) === Number(digits[9]) &&
    checkDigit(digits.slice(0, 10)) === Number(digits[10])
  )
}

/** CPF para exibir sem expor o número inteiro: `***.456.789-**`. */
export function maskCpf(cpf: string): string {
  const digits = normalizeCpf(cpf)
  if (digits.length !== CPF_LENGTH) {
    throw new Error('CPF inválido')
  }
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`
}
