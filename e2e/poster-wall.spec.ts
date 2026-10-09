import { featuredEvents } from '../src/data/featured-events'
import { expect, litTitle, openHome, test } from './fixtures'
import type { Page } from './fixtures'

const total = featuredEvents.length
const titleAt = (index: number) =>
  featuredEvents[((index % total) + total) % total].title

/**
 * O cartaz aceso termina o deslize no centro da tela (o carrossel não ficou torto).
 * Espera a animação acabar: o título muda na hora, o trilho leva 780ms.
 */
async function expectLitPosterCentered(page: Page) {
  const viewport = page.viewportSize()!
  await expect
    .poll(
      async () => {
        const box = await page
          .locator('.wall__slot[data-active="true"]')
          .boundingBox()
        return box
          ? Math.abs(box.x + box.width / 2 - viewport.width / 2)
          : Infinity
      },
      { message: 'distância do cartaz aceso até o centro da tela' },
    )
    .toBeLessThan(2)
}

test.describe('muro de cartazes', () => {
  test.beforeEach(async ({ page }) => openHome(page))

  test('clicar num cartaz vizinho traz ele para o centro', async ({ page }) => {
    // Bug que escapou: o plano 3D do palco engolia os cliques nos cartazes.
    await expect(litTitle(page)).toHaveText(titleAt(0))

    await page.getByRole('button', { name: `Ver ${titleAt(1)}` }).click()
    await expect(litTitle(page)).toHaveText(titleAt(1))

    await page.getByRole('button', { name: `Ver ${titleAt(0)}` }).click()
    await expect(litTitle(page)).toHaveText(titleAt(0))
    await expectLitPosterCentered(page)
  })

  test('as setas dão a volta completa no carrossel infinito', async ({
    page,
  }) => {
    const next = page.getByRole('button', { name: 'Próximo cartaz' })
    for (let step = 1; step <= total + 1; step++) {
      await next.click()
      await expect(litTitle(page)).toHaveText(titleAt(step))
    }
    // Depois do salto silencioso de volta para a cópia do meio, nada ficou fora do lugar.
    await expect(page.locator('.wall__stage')).toHaveAttribute(
      'data-instant',
      'false',
    )
    await expectLitPosterCentered(page)
  })

  test('as setas do teclado andam para os dois lados', async ({ page }) => {
    await page.keyboard.press('ArrowLeft')
    await expect(litTitle(page)).toHaveText(titleAt(-1))
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(litTitle(page)).toHaveText(titleAt(1))
  })

  test('os pontinhos levam direto ao cartaz', async ({ page }) => {
    await page.getByRole('button', { name: titleAt(3), exact: true }).click()
    await expect(litTitle(page)).toHaveText(titleAt(3))
    await expectLitPosterCentered(page)
  })

  test('arrastar troca de cartaz sem rolar a página', async ({ page }) => {
    // Bug que escapou: o clique no fim do arrasto descia a página até a ficha do show.
    const box = (await page
      .locator('.wall__slot[data-active="true"]')
      .boundingBox())!
    const y = box.y + box.height / 2
    await page.mouse.move(box.x + box.width / 2, y)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 - 140, y, { steps: 8 })
    await page.mouse.up()

    await expect(litTitle(page)).toHaveText(titleAt(1))
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('a volta do carrossel infinito não pisca', async ({ page }) => {
    // Bug que escapou: no salto de volta, os cartazes refaziam a transição de luz e a tela piscava.
    // Mede, quadro a quadro, o brilho do cartaz que está no centro da tela.
    const box = (await page
      .locator('.wall__slot[data-active="true"]')
      .boundingBox())!
    const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 }

    for (const key of ['ArrowLeft', 'ArrowRight'] as const) {
      const unlitFrames = await page.evaluate(
        async ({ x, y, arrow }) => {
          const frames: Array<string> = []
          window.dispatchEvent(new KeyboardEvent('keydown', { key: arrow }))
          const start = performance.now()
          while (performance.now() - start < 1800) {
            await new Promise((resolve) => requestAnimationFrame(resolve))
            const elapsed = performance.now() - start
            // O deslize leva 780ms e o salto de volta acontece logo depois. A partir daí, o
            // cartaz do centro tem que continuar aceso em todos os quadros.
            if (elapsed < 850) continue
            const poster = document
              .elementFromPoint(x, y)
              ?.closest('.wall__slot')
              ?.querySelector('.poster')
            const filter = poster
              ? getComputedStyle(poster).filter
              : 'sem cartaz'
            if (filter !== 'none')
              frames.push(`${Math.round(elapsed)}ms: ${filter}`)
          }
          return frames
        },
        { ...center, arrow: key },
      )
      expect(unlitFrames, `quadros apagados depois de ${key}`).toEqual([])
    }
  })
})

test('antes do JavaScript carregar, o cartaz aceso já está no centro', async ({
  browser,
}) => {
  // Bug que escapou: sem JS, o trilho aparecia deslocado até a hidratação.
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()
  await page.route('https://images.unsplash.com/**', (route) => route.abort())
  await page.goto('/')
  await expectLitPosterCentered(page)
  await context.close()
})
