import { useRef } from 'react'
import { MAX_ORDER_QUANTITY } from './order'

type QuantityControlProps = {
  name: string
  quantity: number
  onChange: (quantity: number) => void
}

export default function QuantityControl({ name, quantity, onChange }: QuantityControlProps) {
  const increase = useRef<HTMLButtonElement>(null)
  return <div className={quantity ? 'quantity-control' : 'quantity-control is-empty'} role="group" aria-label={`Quantidade de ${name}`}>
    {quantity > 0 && <button type="button" aria-label={`Retirar uma unidade de ${name}`} onClick={event => {
      const restoreFocus = quantity === 1 && document.activeElement === event.currentTarget
      onChange(quantity - 1)
      if (restoreFocus) window.requestAnimationFrame(() => increase.current?.focus({ preventScroll: true }))
    }}><span aria-hidden="true">−</span></button>}
    {quantity > 0 && <output aria-live="polite" aria-label={`Quantidade de ${name}`}>{quantity}</output>}
    <button ref={increase} type="button" disabled={quantity >= MAX_ORDER_QUANTITY} aria-label={`Adicionar ${name} ao pedido`} onClick={() => onChange(quantity + 1)}>
      {quantity ? <span aria-hidden="true">+</span> : 'Adicionar'}
    </button>
  </div>
}
