import { allEvents } from '../src/data/all-events'
import { expect, litTitle, openHome, test } from './fixtures'
import type { Page } from './fixtures'

type Rect = { x: number; y: number; width: number; height: number }

/**
 * Espia a View Transition: guarda de onde para onde o cartaz compartilhado
 * (`event-cover`) anima, lendo os keyframes que o navegador gerou.
 */
async function recordCoverTransitions(page: Page) {
  await page.evaluate(() => {
    const original = document.startViewTransition.bind(document)
    const store: Array<{ from?: Keyframe; to?: Keyframe }> = []
    ;(window as unknown as { __covers: typeof store }).__covers = store
    document.startViewTransition = ((update: () => void) => {
      const transition = original(update)
      void transition.ready.then(() => {
        const group = document
          .getAnimations()
          .find(
            (a) =>
              (a.effect as KeyframeEffect | null)?.pseudoElement ===
              '::view-transition-group(event-cover)',
          )
        const frames =
          (group?.effect as KeyframeEffect | undefined)?.getKeyframes() ?? []
        store.push({ from: frames.at(0), to: frames.at(-1) })
      })
      return transition
    }) as typeof document.startViewTransition
  })
}

const coverTransitions = (page: Page) =>
  page.evaluate(
    () =>
      (
        window as unknown as {
          __covers: Array<{ from: Keyframe; to: Keyframe }>
        }
      ).__covers,
  )

const sizeOf = (frame: Keyframe) => ({
  width: Number.parseFloat(String(frame.width)),
  height: Number.parseFloat(String(frame.height)),
})

const expectSameSize = (frame: Keyframe, rect: Rect) => {
  const size = sizeOf(frame)
  expect(Math.abs(size.width - rect.width)).toBeLessThan(2)
  expect(Math.abs(size.height - rect.height)).toBeLessThan(2)
}

test.describe('listagem de todos os eventos', () => {
  test.beforeEach(async ({ page }) => {
    await openHome(page)
    await page
      .getByRole('button', { name: `Ver todos os ${allEvents.length} eventos` })
      .click()
  })

  test('abre com todos os eventos e o foco no botão de fechar', async ({
    page,
  }) => {
    const listing = page.getByRole('dialog', { name: 'Todos os eventos' })
    await expect(listing).toBeVisible()
    await expect(listing.locator('.listing__card')).toHaveCount(
      allEvents.length,
    )
    await expect(
      page.getByRole('button', { name: 'Fechar a listagem de eventos' }),
    ).toBeFocused()
  })

  test('com a listagem aberta, as setas do teclado não mexem no muro', async ({
    page,
  }) => {
    const before = await litTitle(page).textContent()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Escape')
    await expect(page.locator('.listing')).toHaveCount(0)
    await expect(litTitle(page)).toHaveText(before!)
  })

  test('o card vira a capa do evento e volta para o lugar ao fechar', async ({
    page,
  }) => {
    const event = allEvents[4]
    const card = page.locator('.listing__card').nth(4)
    await expect(card).toBeVisible()
    const cardRect = (await card.boundingBox())!
    await recordCoverTransitions(page)

    // Abrir: o cartaz sai do tamanho do card e chega no tamanho da capa do modal.
    await card.click()
    const sheet = page.getByRole('dialog', { name: event.title })
    await expect(sheet).toBeVisible()
    await expect(
      sheet.getByRole('button', { name: `Fechar ${event.title}` }),
    ).toBeFocused()
    await expect.poll(async () => (await coverTransitions(page)).length).toBe(1)
    const coverRect = (await page.locator('.sheet__cover').boundingBox())!
    const [opening] = await coverTransitions(page)
    expectSameSize(opening.from, cardRect)
    expectSameSize(opening.to, coverRect)

    // Fechar com Esc: faz o caminho de volta e devolve o foco para o mesmo card.
    await page.keyboard.press('Escape')
    await expect(page.locator('.sheet')).toHaveCount(0)
    await expect.poll(async () => (await coverTransitions(page)).length).toBe(2)
    const [, closing] = await coverTransitions(page)
    expectSameSize(closing.from, coverRect)
    expectSameSize(closing.to, cardRect)
    await expect(card).toBeFocused()

    // O segundo Esc fecha a listagem.
    await page.keyboard.press('Escape')
    await expect(page.locator('.listing')).toHaveCount(0)
  })
})
