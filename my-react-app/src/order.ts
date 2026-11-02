export type MenuEntry = [name: string, description: string, price: string]

export type OrderProduct = {
  id: string
  name: string
  description: string
  orderName: string
  price: number
}

export type OrderLine = { product: OrderProduct; quantity: number }
export type OrderQuantities = Record<string, number>

export const MAX_ORDER_QUANTITY = 99
export const ORDER_STORAGE_KEY = 'bean-order-v1'

const money = new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 2 })
export const formatMoney = (amount: number) => `${money.format(amount)} MT`
export const menuItemId = (item: MenuEntry) => JSON.stringify(item)

export function createOrderCatalog(items: MenuEntry[]): ReadonlyMap<string, OrderProduct> {
  const products = new Map<string, OrderProduct>()
  for (const item of items) {
    const id = menuItemId(item)
    const price = Number(item[2].replace(/\s*MT$/i, '').replace(/\s/g, '').replace(',', '.'))
    if (!Number.isFinite(price) || price < 0) throw new Error(`Preço inválido: ${item[0]}`)
    products.set(id, { id, name: item[0], description: item[1], orderName: item[0], price })
  }
  // Identical dishes listed in multiple groups share one cart line. Variants keep their details.
  const nameCounts = new Map<string, number>()
  for (const product of products.values()) nameCounts.set(product.name, (nameCounts.get(product.name) ?? 0) + 1)
  for (const product of products.values()) {
    if ((nameCounts.get(product.name) ?? 0) > 1 && product.description) {
      product.orderName = `${product.name} (${product.description})`
    }
  }
  return products
}

export function restoreOrder(value: string | null, catalog: ReadonlyMap<string, OrderProduct>): OrderQuantities {
  if (!value) return {}
  try {
    const stored: unknown = JSON.parse(value)
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
    const restored: OrderQuantities = {}
    for (const [id, quantity] of Object.entries(stored)) {
      if (catalog.has(id) && typeof quantity === 'number' && Number.isInteger(quantity) && quantity > 0 && quantity <= MAX_ORDER_QUANTITY) {
        restored[id] = quantity
      }
    }
    return restored
  } catch {
    return {}
  }
}

export function orderTotal(lines: OrderLine[]) {
  return Math.round(lines.reduce((total, line) => total + line.product.price * line.quantity, 0) * 100) / 100
}

export function orderMessage(lines: OrderLine[], customerName: string, notes: string) {
  const message = [
    'Olá, Bean! Gostaria de fazer este pedido:',
    '',
    ...lines.map(({ product, quantity }) => `${quantity} × ${product.orderName} — ${formatMoney(product.price * quantity)}`),
    '',
    `Total dos itens: ${formatMoney(orderTotal(lines))}`,
  ]
  if (customerName.trim()) message.push(`Nome: ${customerName.trim()}`)
  if (notes.trim()) message.push(`Observações: ${notes.trim()}`)
  message.push('', 'Podem confirmar a disponibilidade e o total, por favor?')
  return message.join('\n')
}

export function normalizeWhatsAppNumber(phone: string) {
  const number = phone.replace(/\D/g, '')
  if (!/^[1-9]\d{6,14}$/.test(number) || number === '258123456') return null
  return number
}

export function whatsAppOrderUrl(phone: string, lines: OrderLine[], customerName: string, notes: string) {
  const recipient = normalizeWhatsAppNumber(phone)
  if (!recipient || !lines.length) return null
  return `https://wa.me/${recipient}?text=${encodeURIComponent(orderMessage(lines, customerName, notes))}`
}
