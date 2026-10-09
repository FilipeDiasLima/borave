import { featuredEvents } from '../src/data/featured-events'
import { expect, litTitle, openHome, test } from './fixtures'
import type { Page } from './fixtures'

const titleAt = (index: number) => featuredEvents[index].title

/** Arrasta o dedo na horizontal sobre o cartaz aceso (toque de verdade, via CDP). */
async function swipe(page: Page, distance: number) {
  const box = (await page
    .locator('.wall__slot[data-active="true"]')
    .boundingBox())!
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  const cdp = await page.context().newCDPSession(page)
  const touch = (
    type: 'touchStart' | 'touchMove' | 'touchEnd',
    touchX: number,
  ) =>
    cdp.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: type === 'touchEnd' ? [] : [{ x: touchX, y }],
    })
  await touch('touchStart', x)
  for (let step = 1; step <= 8; step++)
    await touch('touchMove', x - (distance * step) / 8)
  await touch('touchEnd', x - distance)
  await cdp.detach()
}

test.describe('muro de cartazes no celular', () => {
  test.beforeEach(async ({ page }) => openHome(page))

  test('deslizar o dedo troca de cartaz sem rolar a página', async ({
    page,
  }) => {
    await swipe(page, 140)
    await expect(litTitle(page)).toHaveText(titleAt(1))
    await swipe(page, 140)
    await expect(litTitle(page)).toHaveText(titleAt(2))
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('tocar no cartaz que aparece na lateral traz ele para o centro', async ({
    page,
  }) => {
    await page.getByRole('button', { name: `Ver ${titleAt(1)}` }).tap()
    await expect(litTitle(page)).toHaveText(titleAt(1))
  })

  test('tocar no cartaz aceso desce até a ficha do show', async ({ page }) => {
    await page.locator('.wall__slot[data-active="true"]').tap()
    await expect(page.locator('#o-show')).toBeInViewport()
  })
})

test('antes do JavaScript carregar, o cartaz aceso já está no centro do celular', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.route('https://images.unsplash.com/**', (route) => route.abort())
  await page.goto('/')
  const box = (await page
    .locator('.wall__slot[data-active="true"]')
    .boundingBox())!
  expect(Math.abs(box.x + box.width / 2 - 390 / 2)).toBeLessThan(2)
  await context.close()
})
