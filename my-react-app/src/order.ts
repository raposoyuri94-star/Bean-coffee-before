export type MenuProduct = {
  id: string
  name: string
  description: string
  price: number
}

export type OrderProduct = MenuProduct & {
  orderName: string
}

export type OrderLine = { product: OrderProduct; quantity: number }
export type OrderQuantities = Record<string, number>

export const MAX_ORDER_QUANTITY = 99
export const ORDER_STORAGE_KEY = 'bean-order-v1'

const money = new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 2 })
export const formatMoney = (amount: number) => `${money.format(amount)} MT`

export function createOrderCatalog(items: MenuProduct[]): ReadonlyMap<string, OrderProduct> {
  const products = new Map<string, OrderProduct>()
  for (const item of items) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) throw new Error(`ID inválido: ${item.id}`)
    if (!item.name.trim()) throw new Error(`Nome inválido: ${item.id}`)
    if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) {
      throw new Error(`Preço inválido: ${item.name}`)
    }
    const existing = products.get(item.id)
    if (
      existing &&
      (existing.name !== item.name ||
        existing.description !== item.description ||
        existing.price !== item.price)
    ) {
      throw new Error(`ID duplicado com dados diferentes: ${item.id}`)
    }
    products.set(item.id, { ...item, orderName: item.name })
  }
  // Identical dishes listed in multiple groups share one cart line. Variants keep their details.
  const nameCounts = new Map<string, number>()
  for (const product of products.values())
    nameCounts.set(product.name, (nameCounts.get(product.name) ?? 0) + 1)
  for (const product of products.values()) {
    if ((nameCounts.get(product.name) ?? 0) > 1 && product.description) {
      product.orderName = `${product.name} (${product.description})`
    }
  }
  return products
}

export function restoreOrder(
  value: string | null,
  catalog: ReadonlyMap<string, OrderProduct>
): OrderQuantities {
  if (!value) return {}
  try {
    const stored: unknown = JSON.parse(value)
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
    const restored: OrderQuantities = {}
    for (const [id, quantity] of Object.entries(stored)) {
      if (
        catalog.has(id) &&
        typeof quantity === 'number' &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= MAX_ORDER_QUANTITY
      ) {
        restored[id] = quantity
      }
    }
    // Upgrade carts saved before products had stable IDs. Use today's price.
    // Prefer an existing stable entry if both formats are present in storage.
    for (const [legacyId, quantity] of Object.entries(stored)) {
      if (
        !legacyId.startsWith('[') ||
        typeof quantity !== 'number' ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        quantity > MAX_ORDER_QUANTITY
      )
        continue
      try {
        const entry: unknown = JSON.parse(legacyId)
        if (!Array.isArray(entry) || entry.length !== 3 || !entry.every((value) => typeof value === 'string'))
          continue
        const product = Array.from(catalog.values()).find(
          (item) => item.name === entry[0] && item.description === entry[1]
        )
        if (product && restored[product.id] === undefined) restored[product.id] = quantity
      } catch {
        // A damaged legacy entry must not discard the rest of the order.
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
    ...lines.map(
      ({ product, quantity }) =>
        `${quantity} × ${product.orderName} — ${formatMoney(product.price * quantity)}`
    ),
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
