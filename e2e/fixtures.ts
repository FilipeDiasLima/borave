import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Cartaz falso no lugar das fotos do Unsplash: os testes não dependem da internet
 * e rodam sempre com a mesma imagem. A cor muda por foto só para ajudar a ler os
 * screenshots de falha.
 */
function fakePoster(url: string): string {
  const hue = [...url].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"><rect width="600" height="900" fill="hsl(${hue} 40% 35%)"/></svg>`
}

type Fixtures = {
  /** Erros de JavaScript da página. Todo teste falha se sobrar algum. */
  pageErrors: Array<string>
}

export const test = base.extend<Fixtures>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: Array<string> = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.route('https://images.unsplash.com/**', (route) =>
        route.fulfill({
          contentType: 'image/svg+xml',
          body: fakePoster(route.request().url()),
        }),
      )
      await use(errors)
      expect(errors, 'erros de JavaScript na página').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
export type { Page }

/** Abre a home e espera o React assumir o carrossel (hidratação + primeiro paint). */
export async function openHome(page: Page) {
  await page.goto('/')
  await expect(page.locator('.wall__stage')).toHaveAttribute(
    'data-ready',
    'true',
  )
  await expect(page.locator('.wall__stage')).toHaveAttribute(
    'data-instant',
    'false',
  )
}

/** Título do cartaz aceso, como aparece na legenda do muro. */
export const litTitle = (page: Page) => page.locator('.wall__title')
