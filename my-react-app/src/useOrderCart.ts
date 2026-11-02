import { useCallback, useEffect, useState } from 'react'
import { MAX_ORDER_QUANTITY, ORDER_STORAGE_KEY, orderTotal, restoreOrder } from './order'
import type { OrderLine, OrderProduct } from './order'

export function useOrderCart(catalog: ReadonlyMap<string, OrderProduct>) {
  const [quantities, setQuantities] = useState(() => {
    try {
      return restoreOrder(sessionStorage.getItem(ORDER_STORAGE_KEY), catalog)
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      if (Object.keys(quantities).length) sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(quantities))
      else sessionStorage.removeItem(ORDER_STORAGE_KEY)
    } catch {
      // Ordering still works when browser storage is unavailable.
    }
  }, [quantities])

  const setQuantity = useCallback((id: string, quantity: number) => {
    if (!catalog.has(id) || !Number.isFinite(quantity)) return
    const nextQuantity = Math.max(0, Math.min(MAX_ORDER_QUANTITY, Math.floor(quantity)))
    setQuantities(previous => {
      if ((previous[id] ?? 0) === nextQuantity) return previous
      const next = { ...previous }
      if (nextQuantity) next[id] = nextQuantity
      else delete next[id]
      return next
    })
  }, [catalog])

  const lines: OrderLine[] = Object.entries(quantities).flatMap(([id, quantity]) => {
    const product = catalog.get(id)
    return product ? [{ product, quantity }] : []
  })

  return {
    quantities,
    setQuantity,
    lines,
    count: lines.reduce((count, line) => count + line.quantity, 0),
    total: orderTotal(lines),
  }
}
