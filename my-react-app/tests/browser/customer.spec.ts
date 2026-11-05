import { test as base, expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { loadEnv } from 'vite'
import { formatMoney, ORDER_STORAGE_KEY } from '../../src/order'

const phone = loadEnv('production', process.cwd(), 'VITE_').VITE_WHATSAPP_NUMBER?.replace(/\D/g, '')

const test = base.extend({
  page: async ({ page }, runTest) => {
    // The map is external; these checks exercise our own interface without loading it.
    await page.route('https://maps.google.com/**', (route) => route.fulfill({ body: '' }))
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await runTest(page)
    expect(errors, 'Unexpected browser runtime errors').toEqual([])
  },
})

async function menuState(menu: Locator) {
  return menu.evaluate((element) => {
    const slide = element.querySelector<HTMLElement>('[data-active="true"]')!
    return {
      active: Array.from(element.children).indexOf(slide),
      height: element.clientHeight,
      pageY: window.scrollY,
      offset: slide.getBoundingClientRect().left - element.getBoundingClientRect().left,
      controls: document.getElementById('menu')!.getBoundingClientRect().top,
      header: document.querySelector('.header')!.getBoundingClientRect().bottom,
      first: slide.querySelector('.menu-item')!.getBoundingClientRect().top,
      map: document.querySelector('.visit-map')!.getBoundingClientRect().top,
      viewport: window.innerHeight,
      innerY: element.scrollTop,
    }
  })
}

async function selectCategory(page: Page, index: number) {
  await page.locator('#menu button').nth(index).click()
  await expect
    .poll(async () => {
      const menu = page.locator('.menu-categories')
      return menu.evaluate(
        (element, selected) =>
          Math.abs(
            element.children[selected].getBoundingClientRect().left - element.getBoundingClientRect().left
          ),
        index
      )
    })
    .toBeLessThanOrEqual(1)
  await expect
    .poll(async () =>
      page
        .locator('.menu-categories')
        .evaluate((element) =>
          Math.abs(
            element.clientHeight -
              element.querySelector('[data-active="true"]')!.getBoundingClientRect().height
          )
        )
    )
    .toBeLessThanOrEqual(1)
}

async function scrollToLastItem(page: Page, index: number) {
  await page
    .locator(`.menu-category:nth-child(${index + 1}) .menu-item`)
    .last()
    .evaluate((element) => {
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top - window.innerHeight / 2,
        behavior: 'instant',
      })
    })
}

async function touch(menu: Locator, type: 'touchstart' | 'touchend') {
  // WebKit automation cannot dispatch native iPhone pans. Hold/release the actual
  // React touch handlers while scrolling the real overflow region instead.
  await menu.evaluate((element, name) => {
    const event = new Event(name, { bubbles: true })
    Object.defineProperty(event, 'touches', { value: name === 'touchstart' ? [{}] : [] })
    element.dispatchEvent(event)
  }, type)
}

async function expectMenuAtStart(menu: Locator, index: number) {
  await expect
    .poll(async () => {
      const state = await menuState(menu)
      return (
        state.active === index &&
        Math.abs(state.offset) <= 1 &&
        state.innerY === 0 &&
        state.controls >= state.header - 1 &&
        state.controls < state.viewport / 2 &&
        state.first > state.header &&
        state.first < state.viewport &&
        state.map > state.viewport
      )
    })
    .toBe(true)
}

test('customers select quantities and open the configured WhatsApp chat with their order', async ({
  page,
  context,
}) => {
  await page.goto('./#menu')
  const toast = page.locator('#menu-pequeno-almoco .menu-item').first()
  await toast.getByRole('button', { name: 'Adicionar Tostas de abacate ao pedido', exact: true }).click()
  await toast.getByRole('button', { name: 'Adicionar Tostas de abacate ao pedido', exact: true }).click()
  await selectCategory(page, 2)
  await page.locator('#menu-bebidas .menu-item').first().getByRole('button').click()
  await page.locator('.order-cart-bar').focus()
  await page.locator('.order-cart-bar').click()
  const dialog = page.getByRole('dialog', { name: 'O seu pedido' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.order-total strong')).toHaveText(formatMoney(1060))
  await dialog.getByLabel('Nome (opcional)').fill('João & Ana')
  await dialog.getByLabel('Observações (opcional)').fill('Sem açúcar.\nLimão + menta?')
  const link = dialog.getByRole('link', { name: 'Continuar no WhatsApp' })
  await expect(link).toBeVisible()
  const url = new URL((await link.getAttribute('href'))!)
  expect(url.origin).toBe('https://wa.me')
  expect(url.pathname).toBe('/' + phone)
  expect(url.searchParams.get('text')).toContain('2 × Tostas de abacate')
  expect(url.searchParams.get('text')).toContain('1 × Americano')
  expect(url.searchParams.get('text')).toContain('Nome: João & Ana')
  expect(url.searchParams.get('text')).toContain('Observações: Sem açúcar.\nLimão + menta?')
  await expect(dialog.locator('.order-recipient')).toHaveText('+' + phone)
  // Fulfil locally: opening the CTA must never send a real request or message.
  await context.route('https://wa.me/**', (route) =>
    route.fulfill({ body: 'WhatsApp handoff captured by the test.' })
  )
  const popupPromise = page.waitForEvent('popup')
  await link.click()
  const popup = await popupPromise
  await popup.waitForLoadState()
  expect(popup.url()).toBe(url.href)
  await popup.close()
  await page.bringToFront()
  await dialog.getByRole('button', { name: 'Fechar pedido' }).click()
  await expect(dialog).not.toBeVisible()
  await expect
    .poll(() => page.evaluate(() => document.activeElement?.classList.contains('order-cart-bar')))
    .toBe(true)
})

test('empty orders lead to the menu and removing the last item keeps the dialog usable', async ({ page }) => {
  await page.goto('./#menu')
  await page.locator('#start-order').click()
  const dialog = page.getByRole('dialog', { name: 'O seu pedido' })
  await expect(dialog).toContainText('O seu pedido ainda está vazio.')
  await dialog.getByRole('button', { name: 'Escolher no menu' }).click()
  await expect(page.locator('#menu button').first()).toBeFocused()
  await page.locator('#menu-pequeno-almoco .menu-item').first().getByRole('button').click()
  await page.locator('.order-cart-bar').click()
  await dialog.getByRole('button', { name: 'Remover Tostas de abacate do pedido', exact: true }).click()
  await expect(dialog).toContainText('O seu pedido ainda está vazio.')
  await expect(dialog.getByRole('button', { name: 'Escolher no menu' })).toBeFocused()
  await expect(page.locator('.order-cart-bar')).toHaveCount(0)
})

test('gallery navigation has a burger menu, active state, and preserves the cart', async ({ page }) => {
  await page.goto('./#menu')
  await page.locator('#menu-pequeno-almoco .menu-item').first().getByRole('button').click()
  await page.reload()
  await expect(page.locator('.order-cart-count')).toHaveText('1')
  const galleryURL = await page.locator('.nav a').filter({ hasText: 'Galeria' }).getAttribute('href')
  await page.goto(galleryURL!)
  await expect
    .poll(() =>
      page
        .locator('.gallery-photo img')
        .first()
        .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
    )
    .toBe(true)
  await page.locator('.gallery-photo').first().click()
  await expect(page.locator('.gallery-dialog')).toBeVisible()
  await page.locator('.gallery-close').click()
  await expect(page.locator('.gallery-dialog')).not.toBeVisible()
  const burger = page.locator('.menu-toggle')
  if (await burger.isVisible()) await burger.click()
  await expect(page.locator('.nav a[aria-current="page"]')).toHaveText('Galeria')
  await page.locator('.nav a').filter({ hasText: 'Menu' }).click()
  await expect(page.locator('#menu button').first()).toBeVisible()
  await expect(page.locator('.order-cart-count')).toHaveText('1')
  const stored = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), ORDER_STORAGE_KEY)
  expect(stored).toEqual({ 'tostas-de-abacate': 1 })
})

test('a held swipe near the bottom never shrinks the menu or jumps into the map', async ({
  page,
  browserName,
}) => {
  // Exercise the fallback needed by Safari versions without scrollend events.
  await page.addInitScript(() =>
    window.addEventListener('scrollend', (event) => event.stopImmediatePropagation(), true)
  )
  await page.goto('./#menu')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('#menu button')).toHaveText(['Pequeno-almoço', 'Almoço', 'Bebidas'])
  const menu = page.locator('.menu-categories')
  for (const [from, to] of [
    [0, 1],
    [1, 2],
    [2, 1],
    [1, 0],
    [0, 2],
    [2, 0],
  ]) {
    await selectCategory(page, from)
    await scrollToLastItem(page, from)
    const before = await menuState(menu)
    await touch(menu, 'touchstart')
    await menu.evaluate(
      (element, index) => element.scrollTo({ left: index * element.clientWidth, behavior: 'instant' }),
      to
    )
    await page.waitForTimeout(450) // Deliberately longer than the settlement delay while a finger stays down.
    const held = await menuState(menu)
    expect(held.height).toBe(before.height)
    expect(held.pageY).toBe(before.pageY)
    await touch(menu, 'touchend')
    await expectMenuAtStart(menu, to)
  }
  if (browserName === 'chromium') {
    // Also exercise a real native pan where Chromium exposes touch input.
    await selectCategory(page, 1)
    await scrollToLastItem(page, 1)
    const before = await menuState(menu)
    const bounds = (await menu.boundingBox())!
    const input = await page.context().newCDPSession(page)
    const y = (await page.viewportSize())!.height / 2
    await input.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: bounds.x + bounds.width - 20, y }],
    })
    for (let step = 1; step <= 12; step++) {
      const x = bounds.x + bounds.width - 20 - ((bounds.width - 40) * step) / 12
      await input.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] })
      await page.waitForTimeout(20)
    }
    await page.waitForTimeout(450)
    const held = await menuState(menu)
    expect(held.height).toBe(before.height)
    expect(held.pageY).toBe(before.pageY)
    await input.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expectMenuAtStart(menu, 2)
    await input.detach()
  }
})

test('page momentum finishes before the menu height changes', async ({ page }) => {
  await page.goto('./#menu')
  await page.evaluate(() => document.fonts.ready)
  await selectCategory(page, 1)
  await scrollToLastItem(page, 1)
  const menu = page.locator('.menu-categories')
  const before = await menuState(menu)
  await touch(menu, 'touchstart')
  await menu.evaluate((element) => element.scrollTo({ left: 2 * element.clientWidth, behavior: 'instant' }))
  await touch(menu, 'touchend')
  // Run momentum inside the browser so automation latency cannot insert a pause
  // longer than the real settlement threshold between movement frames.
  const heights = await menu.evaluate(async (element, top) => {
    const values: number[] = []
    for (let step = 1; step <= 12; step++) {
      window.scrollTo({ top: top + step * 4, behavior: 'instant' })
      await new Promise((resolve) => window.setTimeout(resolve, 40))
      values.push(element.clientHeight)
    }
    return values
  }, before.pageY)
  expect(heights).toEqual(Array(12).fill(before.height))
  await expectMenuAtStart(menu, 2)
})

test('keyboard category navigation and resizing preserve the selected slide', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./#menu')
  const menu = page.locator('.menu-categories')
  await scrollToLastItem(page, 0)
  await menu.focus()
  await page.keyboard.press('End')
  await expectMenuAtStart(menu, 2)
  await page.setViewportSize({ width: 844, height: 390 })
  await expect.poll(async () => Math.abs((await menuState(menu)).offset)).toBeLessThan(1)
  await menu.focus()
  await page.keyboard.press('Home')
  await expect(page.locator('#menu button').first()).toHaveAttribute('aria-pressed', 'true')
})

test('menu rows fit narrow phones and desktop widths without clipping text or controls', async ({ page }) => {
  await page.goto('./#menu')
  for (const width of [320, 390, 760, 761, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await expect
      .poll(async () =>
        page
          .locator('#menu-pequeno-almoco .menu-item')
          .first()
          .evaluate((element) => {
            const row = element.getBoundingClientRect()
            const children = Array.from(
              element.querySelectorAll<HTMLElement>('.item-number, h5, p, .menu-item-order')
            )
            return (
              children.every((child) => {
                const bounds = child.getBoundingClientRect()
                return (
                  bounds.left >= row.left - 1 &&
                  bounds.right <= row.right + 1 &&
                  child.scrollWidth <= child.clientWidth + 1
                )
              }) && document.documentElement.scrollWidth <= window.innerWidth
            )
          })
      )
      .toBe(true)
  }
})
