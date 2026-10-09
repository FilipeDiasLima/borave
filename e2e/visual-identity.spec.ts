import { expect, openHome, test } from './fixtures'
import type { Page } from './fixtures'

/** Cor que um token do styles.css vira no navegador (para comparar com o computado). */
const tokenColor = (page: Page, token: string) =>
  page.evaluate((name) => {
    const probe = document.createElement('div')
    probe.style.color = `var(${name})`
    document.body.append(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  }, token)

test.describe('identidade visual', () => {
  test.beforeEach(async ({ page }) => openHome(page))

  test('a página é o muro à noite: fundo night, texto paper e as fontes do DESIGN.md', async ({
    page,
  }) => {
    // Bug que escapou: o `shadcn init` trocou o tema por um claro e a fonte pela Geist,
    // e nenhum outro teste percebeu (tudo continuava clicável, só ilegível).
    const body = await page.evaluate(() => {
      const style = getComputedStyle(document.body)
      return {
        background: style.backgroundColor,
        color: style.color,
        font: style.fontFamily,
      }
    })
    expect(body.background).toBe(await tokenColor(page, '--night'))
    expect(body.color).toBe(await tokenColor(page, '--paper'))
    expect(body.font).toContain('Schibsted Grotesk')

    const titleFont = await page
      .locator('.wall__title')
      .evaluate((el) => getComputedStyle(el).fontFamily)
    expect(titleFont).toContain('Big Shoulders Display')
  })

  test('os tokens do shadcn apontam para os tokens do Bora Vê', async ({
    page,
  }) => {
    const pairs = [
      ['--background', '--night'],
      ['--foreground', '--paper'],
      ['--primary', '--poster-red'],
      ['--ring', '--tungsten'],
    ] as const
    for (const [shadcn, boraVe] of pairs) {
      expect(await tokenColor(page, shadcn), `${shadcn} = ${boraVe}`).toBe(
        await tokenColor(page, boraVe),
      )
    }
  })
})

test.describe('navegação sem # na URL', () => {
  test.beforeEach(async ({ page }) => openHome(page))

  const jumps = [
    { name: 'Garantir ingresso', section: '#ingressos' },
    { name: 'Conhecer o show', section: '#o-show' },
    { name: 'Ingressos', section: '#ingressos' },
  ]

  for (const { name, section } of jumps) {
    test(`"${name}" leva até a seção e a URL continua sem #`, async ({
      page,
    }) => {
      await page.getByRole('button', { name, exact: true }).click()
      await expect(page.locator(section)).toBeInViewport()
      await expect(page.locator(section)).toBeFocused()
      expect(new URL(page.url()).hash).toBe('')
    })
  }

  test('"Destaques" volta para o muro', async ({ page }) => {
    await page.getByRole('button', { name: 'Ingressos', exact: true }).click()
    await expect(page.locator('#ingressos')).toBeInViewport()
    await page.getByRole('button', { name: 'Destaques', exact: true }).click()
    await expect(page.locator('#em-cartaz')).toBeInViewport()
    expect(new URL(page.url()).hash).toBe('')
  })

  test('nenhum link da página aponta para #', async ({ page }) => {
    const hashLinks = await page
      .locator('a[href^="#"], a[href^="/#"]')
      .evaluateAll((links) => links.map((link) => link.outerHTML.slice(0, 80)))
    expect(hashLinks).toEqual([])
  })
})
