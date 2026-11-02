import { useEffect, useRef, useState } from 'react'
import QuantityControl from './QuantityControl'
import { formatMoney, orderTotal, whatsAppOrderUrl } from './order'
import type { OrderLine } from './order'

type OrderDialogProps = {
  open: boolean
  lines: OrderLine[]
  phone: string
  onClose: () => void
  onBrowse: () => void
  onQuantityChange: (id: string, quantity: number) => void
}

export default function OrderDialog({ open, lines, phone, onClose, onBrowse, onQuantityChange }: OrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [customerName, setCustomerName] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected && previousFocus.getClientRects().length) previousFocus.focus({ preventScroll: true })
      else {
        const toggle = document.querySelector<HTMLElement>('.menu-toggle')
        const fallback = toggle?.getClientRects().length ? toggle : document.getElementById('start-order')
        fallback?.focus({ preventScroll: true })
      }
    }
  }, [open])

  const changeQuantity = (id: string, quantity: number) => {
    onQuantityChange(id, quantity)
    if (quantity === 0) {
      window.requestAnimationFrame(() => {
        dialogRef.current?.querySelector<HTMLElement>('.order-line .quantity-control button, .order-browse')?.focus({ preventScroll: true })
      })
    }
  }

  return <dialog id="order-dialog" ref={dialogRef} className="order-dialog" aria-labelledby="order-title" aria-describedby="order-intro" onClose={onClose} onClick={event => {
    if (event.target === event.currentTarget) onClose()
  }}>
    <div className="order-dialog-content">
      <div className="order-dialog-heading">
        <h2 id="order-title">O seu pedido</h2>
        <button className="order-close" type="button" onClick={onClose} aria-label="Fechar pedido"><span aria-hidden="true">×</span></button>
      </div>
      {lines.length ? <>
        <p id="order-intro" className="order-intro">Reveja os seus favoritos antes de continuar.</p>
        <ul className="order-lines">
          {lines.map(({ product, quantity }) => <li className="order-line" key={product.id}>
            <div className="order-line-copy">
              <h3>{product.name}</h3>
              {product.description && <p>{product.description}</p>}
              <span>{formatMoney(product.price)} / unidade</span>
              <button className="order-remove" type="button" onClick={() => changeQuantity(product.id, 0)} aria-label={`Remover ${product.name} do pedido`}>Remover</button>
            </div>
            <div className="order-line-actions">
              <strong>{formatMoney(product.price * quantity)}</strong>
              <QuantityControl name={product.orderName} quantity={quantity} onChange={value => changeQuantity(product.id, value)} />
            </div>
          </li>)}
        </ul>
        <div className="order-fields">
          <label htmlFor="order-name">Nome <span>(opcional)</span></label>
          <input id="order-name" name="customer-name" autoComplete="name" maxLength={80} value={customerName} onChange={event => setCustomerName(event.target.value)} />
          <label htmlFor="order-notes">Observações <span>(opcional)</span></label>
          <textarea id="order-notes" name="order-notes" autoComplete="off" rows={3} maxLength={500} placeholder="Alergias, preferências ou outras indicações…" value={notes} onChange={event => setNotes(event.target.value)} />
        </div>
        <div className="order-total" aria-live="polite"><span>Total dos itens</span><strong>{formatMoney(orderTotal(lines))}</strong></div>
        <a className="button order-whatsapp" href={whatsAppOrderUrl(phone, lines, customerName, notes)} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp</a>
        <p className="order-handoff-note">O WhatsApp abre com a mensagem pronta para rever e enviar.</p>
        <button type="button" className="order-browse" onClick={onBrowse}>Continuar a escolher</button>
      </> : <div className="order-empty">
        <p id="order-intro">O seu pedido ainda está vazio.</p>
        <p>Escolha os seus favoritos no menu e adicione a quantidade que deseja.</p>
        <button type="button" className="button button-gold order-browse" onClick={onBrowse}>Escolher no menu</button>
      </div>}
    </div>
  </dialog>
}
