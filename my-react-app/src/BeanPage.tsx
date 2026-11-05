import { useState } from 'react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import OrderDialog from './OrderDialog'
import MenuSection from './menu/MenuSection'
import { orderCatalog } from './data/menu'
import { formatMoney } from './order'
import { useOrderCart } from './useOrderCart'
import { useInitialHashScroll } from './useInitialHashScroll'
import './BeanPage.css'
import './Order.css'

const locationQuery = encodeURIComponent('Bean Coffee Shop, 822 Av. Julius Nyerere, Maputo, Mozambique')
const orderPhone = import.meta.env.VITE_WHATSAPP_NUMBER ?? ''

export default function BeanPage() {
  const [open, setOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const order = useOrderCart(orderCatalog)
  useInitialHashScroll()

  const browseMenu = () => {
    setOrderOpen(false)
    window.requestAnimationFrame(() => {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'instant', block: 'start' })
      document
        .querySelector<HTMLElement>('.menu-category-controls button[aria-pressed="true"]')
        ?.focus({ preventScroll: true })
    })
  }

  return (
    <div className={order.count ? 'site-shell has-order' : 'site-shell'}>
      <a className="skip-link" href="#top">
        Saltar para o conteúdo
      </a>
      <SiteHeader open={open} onOpenChange={setOpen} onStartOrder={() => setOrderOpen(true)} />
      <main id="top" tabIndex={-1} inert={open}>
        <section className="hero-section">
          <img
            className="hero-image"
            width={1536}
            height={1024}
            src={import.meta.env.BASE_URL + 'bean-hero-clean.webp'}
            alt="Bean Maputo takeaway coffee and bag"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">
              <span />
              Coffee memories in Maputo
            </p>
            <h1>
              Comece o seu dia bem
              <br />
              <em>logo ao amanhecer</em>
            </h1>
            <p className="hero-copy">
              <em>
                Manhãs calmas, café honesto e o ritmo acolhedor da nossa cidade. Venha pelo café. Fique pela
                sensação.
              </em>
            </p>
            <div className="hero-actions">
              <a className="button button-light" href="#menu">
                Explore o nosso menu<span></span>
              </a>
              <a className="text-link" href="#story">
                Descobra a nossa história <span></span>
              </a>
            </div>
          </div>
          <div className="hero-meta">
            <span>MAPUTO, MOÇAMBIQUE</span>
            <span>822 AV. JULIUS NYERERE</span>
          </div>
          <a className="scroll-cue" href="#story" aria-label="Scroll to our story">
            ↓
          </a>
        </section>
        <section className="manifesto" id="story">
          <p className="section-tag">Nossa filosofia</p>
          <p className="manifesto-text">O café deve ser como um abraço quentinho em uma xícara.</p>
          <div className="principles">
            <article>
              <strong>01</strong>
              <div>
                <h3>Localmente fundamentado</h3>
                <p>
                  Nascido em Maputo, moldado pelo seu calor, pelas suas cores e pela sua energia irresistível.
                </p>
              </div>
            </article>
            <article>
              <strong>02</strong>
              <div>
                <h3>Cuidadosamente selecionado</h3>
                <p>
                  Grãos selecionados com cuidado, respeitando as pessoas e os lugares por trás de cada
                  colheita.
                </p>
              </div>
            </article>
            <article>
              <strong>03</strong>
              <div>
                <h3>Feito com intenção</h3>
                <p>Cada xícara afinada com precisão e servida com a autêntica hospitalidade moçambicana.</p>
              </div>
            </article>
          </div>
        </section>
        <MenuSection
          quantities={order.quantities}
          onQuantityChange={order.setQuantity}
          count={order.count}
          onStartOrder={() => setOrderOpen(true)}
        />
        <section className="visit-section" id="visit">
          <div>
            <p className="section-tag">Venha dizer olá</p>
            <h2>
              Uma boa xícara está
              <br />
              mais perto do que você imagina.
            </h2>
          </div>
          <div className="visit-details">
            <div>
              <span>Encontre-nos</span>
              <p>
                822 Av. Julius Nyerere
                <br />
                Maputo, Moçambique
              </p>
            </div>
            <div>
              <span>Horário de funcionamento</span>
              <p>
                Seg - Sex &nbsp; 07:00-18:00
                <br />
                Sáb - Dom &nbsp; 08:00-16:00
              </p>
            </div>
            <div className="visit-map">
              <iframe
                title="Mapa da Bean Coffee Shop em Maputo"
                src={`https://maps.google.com/maps?q=${locationQuery}&z=17&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${locationQuery}`}
                target="_blank"
                rel="noreferrer"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter navigationOpen={open} />
      {order.count > 0 && (
        <button
          className="order-cart-bar"
          type="button"
          inert={open}
          aria-haspopup="dialog"
          aria-label={`Ver pedido: ${order.count} ${order.count === 1 ? 'artigo' : 'artigos'}, ${formatMoney(order.total)}`}
          onClick={() => setOrderOpen(true)}
        >
          <span className="order-cart-count" aria-hidden="true">
            {order.count}
          </span>
          <span>Ver pedido</span>
          <strong>{formatMoney(order.total)}</strong>
        </button>
      )}
      <p className="order-announcement" role="status">
        {order.count
          ? `${order.count} ${order.count === 1 ? 'artigo' : 'artigos'} no pedido. Total: ${formatMoney(order.total)}.`
          : 'O pedido está vazio.'}
      </p>
      <OrderDialog
        open={orderOpen}
        lines={order.lines}
        phone={orderPhone}
        onClose={() => setOrderOpen(false)}
        onBrowse={browseMenu}
        onQuantityChange={order.setQuantity}
      />
    </div>
  )
}
