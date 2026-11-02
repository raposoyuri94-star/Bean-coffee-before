import assert from 'node:assert/strict'
import test from 'node:test'
import { createOrderCatalog, formatMoney, menuItemId, orderMessage, orderTotal, restoreOrder, whatsAppOrderUrl } from '../src/order.ts'
import type { MenuEntry, OrderLine } from '../src/order.ts'

const toast: MenuEntry = ['Tostas de abacate', 'Pão multigrãos e abacate', '430 MT']
const coffee: MenuEntry = ['Americano', 'Expresso duplo com água quente', '200 MT']
const water: MenuEntry = ['Água das pedras', '', '150 MT']
const flavouredWater: MenuEntry = ['Água das pedras', 'Tangerina, frutos vermelhos, limão', '150 MT']
const catalog = createOrderCatalog([toast, coffee, water, flavouredWater, toast])
const lines: OrderLine[] = [
  { product: catalog.get(menuItemId(toast))!, quantity: 2 },
  { product: catalog.get(menuItemId(coffee))!, quantity: 3 },
]

test('totals use quantities and menu prices across food and drinks', () => {
  assert.equal(orderTotal(lines), 1460)
  assert.equal(orderTotal([]), 0)
})

test('the same dish in two menu groups shares a product', () => {
  assert.equal(catalog.size, 4)
  assert.equal(catalog.get(menuItemId(toast))?.name, 'Tostas de abacate')
})

test('similarly named drink variants stay distinct in the WhatsApp message', () => {
  const plain = catalog.get(menuItemId(water))!
  const flavoured = catalog.get(menuItemId(flavouredWater))!
  assert.notEqual(plain.id, flavoured.id)
  assert.equal(plain.orderName, 'Água das pedras')
  assert.equal(flavoured.orderName, 'Água das pedras (Tangerina, frutos vermelhos, limão)')
  const message = orderMessage([{ product: plain, quantity: 1 }, { product: flavoured, quantity: 2 }], '', '')
  assert.ok(message.includes(`1 × Água das pedras — ${formatMoney(150)}`))
  assert.ok(message.includes('2 × Água das pedras (Tangerina, frutos vermelhos, limão)'))
})

test('restoring a cart accepts known integer quantities and discards damaged data', () => {
  const valid = menuItemId(toast)
  const invalid = menuItemId(coffee)
  for (const quantity of [-1, 0, 0.5, 100, '3', null]) {
    assert.deepEqual(restoreOrder(JSON.stringify({ [valid]: 2, [invalid]: quantity, unknown: 1 }), catalog), { [valid]: 2 })
  }
  assert.deepEqual(restoreOrder(JSON.stringify({ [valid]: 99 }), catalog), { [valid]: 99 })
})

test('invalid or unavailable stored carts start empty', () => {
  for (const value of [null, '', '{broken', 'null', 'true', '[]', '123']) assert.deepEqual(restoreOrder(value, catalog), {})
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
  const url = new URL(whatsAppOrderUrl('+258 84 123 45 67', lines, name, notes))
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/258841234567')
  assert.equal(url.searchParams.get('text'), orderMessage(lines, name, notes))
  assert.equal([...url.searchParams.keys()].length, 1)
})

test('invalid menu prices cannot silently become free items', () => {
  assert.throws(() => createOrderCatalog([['Item', '', 'Consultar']]), /Preço inválido/)
  assert.throws(() => createOrderCatalog([['Item', '', '-10 MT']]), /Preço inválido/)
})
