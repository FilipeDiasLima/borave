import { PER_ORDER_LIMIT, featuredEvents } from '../src/data/featured-events'
import { maxPurchasable } from '../src/domain/tickets/purchase-limits'
import { formatBRL } from '../src/lib/format'
import { expect, litTitle, openHome, test } from './fixtures'

// A bilheteria da home nunca deixa pedir mais do que cabe: nem acima da capacidade
// do setor, nem acima do limite por pedido. Confere todos os setores dos destaques.
for (const [index, event] of featuredEvents.entries()) {
  test(`bilheteria de ${event.title} respeita capacidade e limite por pedido`, async ({
    page,
  }) => {
    await openHome(page)
    await page.getByRole('button', { name: event.title, exact: true }).click()
    await expect(litTitle(page)).toHaveText(featuredEvents[index].title)

    const booth = page.locator('#ingressos')
    let expectedCents = 0
    for (const tier of event.tiers) {
      const limit = maxPurchasable({
        capacity: tier.capacity,
        sold: tier.sold,
        perOrderLimit: PER_ORDER_LIMIT,
      })
      const add = booth.getByRole('button', {
        name: `Adicionar um ingresso ${tier.name}`,
        exact: true,
      })
      const stepper = booth.getByRole('group', {
        name: `Quantidade de ${tier.name}`,
        exact: true,
      })

      for (let clicks = 0; clicks < limit; clicks++) await add.click()
      await expect(stepper.locator('output')).toHaveText(String(limit))
      await expect(add, `setor ${tier.name} trava em ${limit}`).toBeDisabled()
      expectedCents += tier.priceCents * limit
    }

    await expect(booth.locator('.summary__total-value')).toHaveText(
      formatBRL(expectedCents),
    )
  })
}
