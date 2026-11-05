import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createOrderCatalog,
  formatMoney,
  normalizeWhatsAppNumber,
  orderMessage,
  orderTotal,
  restoreOrder,
  whatsAppOrderUrl,
} from '../src/order.ts'
import type { MenuProduct, OrderLine } from '../src/order.ts'
import { menuCategories } from '../src/data/menu.ts'

const toast: MenuProduct = {
  id: 'avocado-toast',
  name: 'Tostas de abacate',
  description: 'Pão multigrãos e abacate',
  price: 430,
}
const coffee: MenuProduct = {
  id: 'americano',
  name: 'Americano',
  description: 'Expresso duplo com água quente',
  price: 200,
}
const water: MenuProduct = { id: 'water', name: 'Água das pedras', description: '', price: 150 }
const flavouredWater: MenuProduct = {
  id: 'water-flavoured',
  name: 'Água das pedras',
  description: 'Tangerina, frutos vermelhos, limão',
  price: 150,
}
const catalog = createOrderCatalog([toast, coffee, water, flavouredWater, toast])
const lines: OrderLine[] = [
  { product: catalog.get(toast.id)!, quantity: 2 },
  { product: catalog.get(coffee.id)!, quantity: 3 },
]

test('totals use quantities and menu prices across food and drinks', () => {
  assert.equal(orderTotal(lines), 1460)
  assert.equal(orderTotal([]), 0)
})

test('the same dish in two menu groups shares a product', () => {
  assert.equal(catalog.size, 4)
  assert.equal(catalog.get(toast.id)?.name, 'Tostas de abacate')
})

test('similarly named drink variants stay distinct in the WhatsApp message', () => {
  const plain = catalog.get(water.id)!
  const flavoured = catalog.get(flavouredWater.id)!
  assert.notEqual(plain.id, flavoured.id)
  assert.equal(plain.orderName, 'Água das pedras')
  assert.equal(flavoured.orderName, 'Água das pedras (Tangerina, frutos vermelhos, limão)')
  const message = orderMessage(
    [
      { product: plain, quantity: 1 },
      { product: flavoured, quantity: 2 },
    ],
    '',
    ''
  )
  assert.ok(message.includes(`1 × Água das pedras — ${formatMoney(150)}`))
  assert.ok(message.includes('2 × Água das pedras (Tangerina, frutos vermelhos, limão)'))
})

test('restoring a cart accepts known integer quantities and discards damaged data', () => {
  const valid = toast.id
  const invalid = coffee.id
  for (const quantity of [-1, 0, 0.5, 100, '3', null]) {
    assert.deepEqual(restoreOrder(JSON.stringify({ [valid]: 2, [invalid]: quantity, unknown: 1 }), catalog), {
      [valid]: 2,
    })
  }
  assert.deepEqual(restoreOrder(JSON.stringify({ [valid]: 99 }), catalog), { [valid]: 99 })
})

test('invalid or unavailable stored carts start empty', () => {
  for (const value of [null, '', '{broken', 'null', 'true', '[]', '123'])
    assert.deepEqual(restoreOrder(value, catalog), {})
})

test('an order message includes item quantities, total, customer name, and notes', () => {
  const message = orderMessage(lines, '  João & Ana  ', '  Sem cebola.\nAlergia a castanhas.  ')
  assert.ok(message.includes(`2 × Tostas de abacate — ${formatMoney(860)}`))
  assert.ok(message.includes(`3 × Americano — ${formatMoney(600)}`))
  assert.ok(message.includes(`Total dos itens: ${formatMoney(1460)}`))
  assert.ok(message.includes('Nome: João & Ana'))
  assert.ok(message.includes('Observações: Sem cebola.\nAlergia a castanhas.'))
  assert.ok(message.endsWith('Podem confirmar a disponibilidade e o total, por favor?'))
})

test('empty optional fields do not add blank name or note labels', () => {
  const message = orderMessage(lines, '  ', '\n')
  assert.ok(!message.includes('Nome:'))
  assert.ok(!message.includes('Observações:'))
})

test('WhatsApp links preserve accents, ampersands, line breaks, and the recipient', () => {
  const name = 'João & Ana'
  const notes = 'Limão + menta? 50% gelo\nSem açúcar '
  const link = whatsAppOrderUrl('+258 84 123 45 67', lines, name, notes)
  assert.ok(link)
  const url = new URL(link)
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/258841234567')
  assert.equal(url.searchParams.get('text'), orderMessage(lines, name, notes))
  assert.equal([...url.searchParams.keys()].length, 1)
})

test('missing, invalid, or placeholder numbers never open a different WhatsApp chat', () => {
  for (const phone of ['', '   ', 'abc', '258123456', '0123456789', '1234567890123456']) {
    assert.equal(normalizeWhatsAppNumber(phone), null)
    assert.equal(whatsAppOrderUrl(phone, lines, '', ''), null)
  }
})

test('the configured number is used without a fallback, and empty orders cannot be sent', () => {
  assert.equal(normalizeWhatsAppNumber(' +258 84 3341600 '), '258843341600')
  const link = whatsAppOrderUrl(' +258 84 3341600 ', lines, '', '')
  assert.ok(link)
  assert.equal(new URL(link).pathname, '/258843341600')
  assert.equal(whatsAppOrderUrl('258843341600', [], '', ''), null)
})

test('prices must be finite numbers, including when menu data comes from outside TypeScript', () => {
  for (const price of ['', '   ', '1.000 MT', 'Consultar', -10, NaN, Infinity, null]) {
    assert.throws(() => createOrderCatalog([{ ...toast, price } as MenuProduct]), /Preço inválido/)
  }
  const expensive = createOrderCatalog([{ ...toast, price: 1000.5 }]).get(toast.id)!
  assert.equal(orderTotal([{ product: expensive, quantity: 2 }]), 2001)
  assert.ok(orderMessage([{ product: expensive, quantity: 1 }], '', '').includes(formatMoney(1000.5)))
})

test('saved quantities survive a product name, description, or price change', () => {
  const edited = createOrderCatalog([
    { ...toast, name: 'Tosta de abacate', description: 'Receita atualizada', price: 450 },
  ])
  const restored = restoreOrder(JSON.stringify({ [toast.id]: 2 }), edited)
  assert.deepEqual(restored, { [toast.id]: 2 })
  assert.equal(orderTotal([{ product: edited.get(toast.id)!, quantity: restored[toast.id] }]), 900)
})

test('old carts migrate to stable IDs with current prices without doubling quantities', () => {
  const legacyId = JSON.stringify([toast.name, toast.description, '400 MT'])
  assert.deepEqual(restoreOrder(JSON.stringify({ [legacyId]: 2 }), catalog), { [toast.id]: 2 })
  assert.deepEqual(restoreOrder(JSON.stringify({ [legacyId]: 2, [toast.id]: 3 }), catalog), { [toast.id]: 3 })
  const unknown = JSON.stringify(['Removed dish', '', '400 MT'])
  const stored = { [unknown]: 1, '[broken': 4, [legacyId]: 0.5, [coffee.id]: 1 }
  assert.deepEqual(restoreOrder(JSON.stringify(stored), catalog), { [coffee.id]: 1 })
})

test('conflicting IDs fail rather than silently changing another dish', () => {
  assert.throws(() => createOrderCatalog([toast, { ...coffee, id: toast.id }]), /ID duplicado/)
  assert.throws(() => createOrderCatalog([{ ...toast, id: '__proto__' }]), /ID inválido/)
  assert.throws(() => createOrderCatalog([{ ...toast, name: ' ' }]), /Nome inválido/)
})

test('the real menu keeps drinks last and shares only intentional duplicates', () => {
  assert.deepEqual(
    menuCategories.map((category) => category.id),
    ['pequeno-almoco', 'almoco', 'bebidas']
  )
  const entries = menuCategories.flatMap(
    (category) => category.groups?.flatMap((group) => group.items) ?? category.items ?? []
  )
  for (const name of ['Guacamole', 'Húmus']) {
    const repeated = entries.filter((item) => item.name === name)
    assert.equal(repeated.length, 2)
    assert.equal(new Set(repeated.map((item) => item.id)).size, 1)
  }
  assert.equal(
    new Set(entries.filter((item) => item.name === 'Água das pedras').map((item) => item.id)).size,
    2
  )
})
