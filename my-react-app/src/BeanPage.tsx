import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SiteHeader, { Brand } from './SiteHeader'
import OrderDialog from './OrderDialog'
import QuantityControl from './QuantityControl'
import { createOrderCatalog, formatMoney, menuItemId } from './order'
import type { MenuEntry, OrderQuantities } from './order'
import { useOrderCart } from './useOrderCart'
import { useInitialHashScroll } from './useInitialHashScroll'
import './BeanPage.css'
import './Order.css'



// Adicione itens como ['Nome', 'Descrição', 'Preço'] em items.
// Em cada secção, cada grupo tem a sua própria lista items.
type MenuGroup = { name: string; items: MenuEntry[] }
type MenuCategory = { id: string; name: string; items?: MenuEntry[]; groups?: MenuGroup[] }

const menuCategories: MenuCategory[] = [
  {
    id: 'pequeno-almoco',
    name: 'Pequeno-almoço',
    groups: [
      { name: 'Healthy toast', items: [
        ['Tostas de abacate', 'Pão multigrãos tostado, abacate e rúcula', '430 MT'],
        ['Tostas de abacate e ovos de codorniz', 'Pão multigrãos tostado, abacate, ovos de codorniz escalfados e rúcula', '530 MT'],
        ['Tostas de abacate e frango', 'Pão multigrãos tostado, abacate, peito de frango, molho de iogurte e rúcula', '600 MT'],
        ['Tostas de salmão fumado e queijo cottage', 'Pão integral tostado, queijo cottage, salmão fumado e rúcula', '850 MT'],
        ['Tostas de salmão fumado e abacate', 'Pão integral tostado, abacate, salmão fumado e rúcula', '850 MT'],
        ['Extra ovo escalfado', '', '130 MT'],
      ] },
      { name: 'Toasties e mais!', items: [
        ['Bean grilled cheese', 'Pão caseiro tostado, cheddar branco, cheddar amarelo, parmesão, cebola caramelizada e tomate', '500 MT'],
        ['Bean grilled cheese com chouriço', 'Pão caseiro tostado, chouriço, cheddar branco, cheddar amarelo, parmesão, cebola caramelizada e tomate', '600 MT'],
        ['Bean tosta mista', 'Pão caseiro tostado, fiambre e cheddar branco. Opção halal disponível com mortadela de peru.', '530 MT'],
        ['Croissant com omelete', 'Croissant francês com recheio de omelete e rúcula', '370 MT'],
        ['Croissant misto', 'Croissant francês com recheio de fiambre, queijo cheddar, tomate e rúcula. Pode ser servido prensado. Opção halal disponível com mortadela de peru.', '440 MT'],
        ['Sandes mista', 'Bola de avó com recheio de fiambre, queijo cheddar, tomate e alface. Opção halal disponível com mortadela de peru.', '250 MT'],
        ['Sandes caprese', 'Bola de avó com recheio de peito de frango, molho pesto, tomate e mozzarella. Contém alho e castanha.', '350 MT'],
        ['Prego Bean', 'O prego à maneira Bean! Filete de boi temperado, servido em pão de hot dog com molho de mostarda e vinho branco', '570 MT'],
        ['Extra chips de batata', '', '80 MT'],
      ] },
      { name: 'Egg lovers', items: [
        ['French omelete', 'Omelete francesa simples', '350 MT'],
        ['Omelete de vegetais', 'Omelete francesa com tomate, espinafre e feta', '450 MT'],
        ['Omelete mista', 'Omelete francesa com fiambre, cheddar branco e parmesão. Opção halal disponível com mortadela de peru.', '470 MT'],
        ['Omelete de chouriço e parmesão', 'Omelete francesa com chouriço, cheddar branco e parmesão', '470 MT'],
      ] },
      { name: 'Sweet', items: [
        ['Granola bowl', 'Granola, iogurte double cream e frutas vermelhas. Contém amendoim e castanha de caju.', '550 MT'],
        ['Croissant francês', '', '170 MT'],
        ['Croissant Paris', 'Croissant francês, geleia de morango e manteiga', '300 MT'],
        ['Crêpes Suzette', 'Crêpes franceses com molho de laranja e manteiga', '450 MT'],
        ['Crêpes de Nutella', 'Crêpes franceses com recheio de Nutella', '450 MT'],
        ['Salada de fruta', 'Maçã, banana, papaia, laranja, hortelã e mel', '400 MT'],
        ['Banana bread', 'Bolo de banana tostado', '250 MT'],
        ['Brownie Bean', 'O verdadeiro brownie de chocolate duplo! Contém castanha de caju.', '280 MT'],
        ['Tarte de limão', 'Tarte de limão francesa', '350 MT'],
        ['Bolo fundente de chocolate', '', '400 MT'],
        ['Mini bolos', 'Mini muffin de chocolate e manteiga de amendoim', '100 MT'],
        ['Cookies', 'Cookies com chocolate 70% de cacau', '100 MT'],
        ['Healthy apple cake', 'Bolo de maçã saudável', '250 MT'],
        ['Cake de limão', 'Bolo de limão servido com queijo creme', '300 MT'],
      ] },
    ],
  },
  {
    id: 'almoco',
    name: 'Almoço',
    groups: [
      { name: 'Entradas', items: [
        ['Ceviche de atum', 'Atum cru temperado em molho de azeite e limão, leite de coco, abacate, pepino, cenoura e ervas frescas', '750 MT'],
        ['Salada de caranguejo', 'Caranguejo desfiado, molho de leite de coco, azeite e limão, abacate, pepino e ervas frescas', '750 MT'],
        ['Guacamole', 'Puré de abacate com temperos, nachos, palitos de cenoura e pepino', '400 MT'],
        ['Húmus', 'Pasta de grão-de-bico, tostas de pão árabe, palitos de pepino e cenoura', '400 MT'],
      ] },
      { name: 'Saladas keto', items: [
        ['Salada de salmão fumado', 'Salada de alface e rúcula, salmão fumado, abacate, tomate, pepino, molho de vinagre balsâmico e azeite', '900 MT'],
        ['Salada de frango', 'Salada de alface e rúcula, peito de frango, ovo cozido malpassado, abacate, tomate, pepino, molho vinagrete, molho de iogurte e sementes', '700 MT'],
        ['Salada de vegetais com húmus ou feta', 'Salada de alface e rúcula, abóbora assada, tomate-cereja assado, abacate, tomate, pepino, molho vinagrete, sementes e escolha de húmus ou feta', '700 MT'],
      ] },
      { name: 'Bread', items: [
        ['Chicken olé olé', 'Pão pita tostado e recheado com peito de frango, salada de tomate e pepino, molho de iogurte, pimento assado, cebola caramelizada, abacate e ervas frescas', '750 MT'],
        ['Vegan Luckystar', 'Pão pita tostado recheado com abóbora assada, pimento assado, tomate-cereja assado, húmus, rúcula e cebola caramelizada', '700 MT'],
      ] },
      { name: 'Nourishing bowls', items: [
        ['Tuna poke bowl', 'Sushi bowl composto de atum cru, arroz branco, pepino, abacate, algas e molho de soja', '900 MT'],
        ['Crab poke bowl', 'Sushi bowl composto de caranguejo desfiado, arroz branco, pepino, abacate, papaia, algas e molho de soja', '900 MT'],
        ['Chicken pasta salad', 'Salada fria de massa orzo (massa grega), peito de frango, molho pesto (contém alho e castanha de caju), tomate, pimento assado, feta e azeitonas', '760 MT'],
        ['Salada balinesa de frango', 'Salada de massa de arroz e peito de frango desfiado, raspa de cenoura, molho de limão e coentro. Contém óleo de coco.', '700 MT'],
        ['Salada balinesa de caranguejo', 'Salada de massa de arroz e caranguejo, raspa de cenoura, molho de limão e coentro. Contém óleo de coco.', '900 MT'],
        ['Olé bowl', 'Bowl composto de peito de frango, arroz branco, salada de tomate, pimento assado, abacate e crème fraîche', '700 MT'],
        ['Quinoa bowl', 'Salada de quinoa, tomate, pepino, ervas frescas, húmus de pimento assado e rúcula', '760 MT'],
        ['Mil-folhas de lentilhas', 'Salada de lentilhas, tomate e abacate, tostas de batata-doce e creme de queijo', '670 MT'],
      ] },
      { name: 'Sugestão de tapas', items: [
        ['Nachos de atum', 'Chips de tortilha com topping de tártaro de atum asiático e abacate', '750 MT'],
        ['Nachos de caranguejo', 'Chips de tortilha com topping de caranguejo desfiado e abacate', '750 MT'],
        ['Salmon bites', 'Mini torradas de salmão fumado e queijo cottage (5 peças)', '750 MT'],
        ['Presunto e torradas', 'Presunto fatiado acompanhado de torradas de pão e puré de tomate. Contém alho.', '500 MT'],
        ['Tacos de frango', 'Cestinho com recheio de frango desfiado, pimento assado, abacate, tomate, cebola caramelizada e molho de iogurte (4 peças)', '500 MT'],
        ['Húmus', 'Pasta de grão-de-bico, tostas de pão árabe, palitos de pepino e cenoura', '400 MT'],
        ['Guacamole', 'Puré de abacate com temperos, nachos, palitos de cenoura e pepino', '400 MT'],
      ] },
    ],
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    groups: [
      { name: 'Café', items: [
        ['Americano', 'Expresso duplo com água quente', '200 MT'],
        ['Hot chocolate', 'chocolate preto com creme de leite e chantilly', '200 MT'],
        ['Expresso', 'Blend Brasil/Uganda 100% arábica', '260 MT'],
        ['Expresso descafeinado', 'Opção sem cafeína', '130 MT'],
        ['Cappuccino', 'Expresso duplo com 1/2 creme de leite', '250 MT'],
        ['Macchiato', 'Expresso simples com creme de leite', '150 MT'],
        ['Flat white', 'Expresso duplo com 1/3 creme de leite', '190 MT'],
        ['Café latte', 'Expresso simples com creme de leite', '250 MT'],
      ] },
      { name: 'Chá natural', items: [
        ['Balacate', '', '180 MT'],
        ['Menta', '', '180 MT'],
        ['Matcha', '', '200 MT'],
        ['Ginger', '', '200 MT'],
      ] },
      { name: 'Chá de saqueta', items: [
        ['Rooibos', '', '120 MT'],
        ['Verde', '', '180 MT'],
        ['Frutos vermelhos', '', '200 MT'],
      ] },
      { name: 'Bebidas frias', items: [
        ['Água pequena', '', '100 MT'],
        ['Água das pedras', '', '150 MT'],
        ['Água das pedras', 'Tangerina, frutos vermelhos, limão', '150 MT'],
      ] },
      { name: 'Soft drinks', items: [
        ['Tónica zero', '', '100 MT'],
        ['Sprite zero', '', '120 MT'],
        ['Coca-Cola Zero', '', '120 MT'],
      ] },
    ],
  },
]

const locationQuery = encodeURIComponent('Bean Coffee Shop, 822 Av. Julius Nyerere, Maputo, Mozambique')
const orderCatalog = createOrderCatalog(menuCategories.flatMap(category => category.groups
  ? category.groups.flatMap(group => group.items)
  : category.items ?? []))
const orderPhone = import.meta.env.VITE_WHATSAPP_NUMBER || '258123456'

function MenuItems({ items, quantities, onQuantityChange }: {
  items: MenuEntry[]
  quantities: OrderQuantities
  onQuantityChange: (id: string, quantity: number) => void
}) {
  return <div className="menu-list">
    {items.length ? items.map((item, i) => {
      const id = menuItemId(item)
      return <article className="menu-item" key={id}>
      <span className="item-number">{String(i + 1).padStart(2, '0')}</span>
      <div><h5>{item[0]}</h5>{item[1] && <p>{item[1]}</p>}</div>
      <div className="menu-item-order">
        <strong>{item[2]}</strong>
        <QuantityControl name={orderCatalog.get(id)?.orderName ?? item[0]} quantity={quantities[id] ?? 0} onChange={quantity => onQuantityChange(id, quantity)} />
      </div>
    </article>}) : <p className="menu-category-empty">Novidades em breve.</p>}
  </div>
}
export default function BeanPage() {
  const [open, setOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const order = useOrderCart(orderCatalog)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuScrollFrame = useRef<number | undefined>(undefined)
  const menuTouchActive = useRef(false)
  const requestedCategory = useRef<number | null>(null)
  const [menuCategory, setMenuCategory] = useState(0)
  const [settledMenuCategory, setSettledMenuCategory] = useState(0)
  useInitialHashScroll()

  const browseMenu = () => {
    setOrderOpen(false)
    window.requestAnimationFrame(() => {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'instant', block: 'start' })
      document.querySelector<HTMLElement>('.menu-category-controls button[aria-pressed="true"]')?.focus({ preventScroll: true })
    })
  }

  useEffect(() => () => window.cancelAnimationFrame(menuScrollFrame.current ?? 0), [])

  // Keep slides laid out during a swipe; resize only after scrolling settles.
  useLayoutEffect(() => {
    const menu = menuRef.current
    const slide = menu?.children[settledMenuCategory]
    if (!menu || !slide) return

    let previousWidth = menu.clientWidth
    const updateLayout = () => {
      const scrollbarHeight = menu.offsetHeight - menu.clientHeight
      menu.style.height = `${Math.ceil(slide.getBoundingClientRect().height) + scrollbarHeight}px`
      menu.scrollTop = 0
      if (menu.clientWidth !== previousWidth) {
        previousWidth = menu.clientWidth
        menu.scrollTo({
          left: menu.scrollLeft + slide.getBoundingClientRect().left - menu.getBoundingClientRect().left,
          behavior: 'instant',
        })
      }
    }
    updateLayout()
    let resizeFrame = 0
    const observer = new ResizeObserver(() => {
      if (resizeFrame) return
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0
        updateLayout()
      })
    })
    observer.observe(slide)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(resizeFrame)
    }
  }, [settledMenuCategory])

  const visibleMenuCategory = () => {
    const menu = menuRef.current
    if (!menu) return menuCategory
    const left = menu.getBoundingClientRect().left
    const distances = Array.from(menu.children, slide => Math.abs(slide.getBoundingClientRect().left - left))
    return distances.indexOf(Math.min(...distances))
  }

  const settleMenuCategory = (index: number) => {
    if (menuTouchActive.current) return
    const menu = menuRef.current
    // Return to the category controls before shortening a menu scrolled past its start.
    if (index !== settledMenuCategory && menu && menu.getBoundingClientRect().top < 0) {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    requestedCategory.current = null
    setMenuCategory(index)
    setSettledMenuCategory(index)
  }

  const syncMenuCategory = () => {
    stopMenuSettlement()
    settleMenuCategory(visibleMenuCategory())
  }

  const stopMenuSettlement = () => {
    window.cancelAnimationFrame(menuScrollFrame.current ?? 0)
    menuScrollFrame.current = undefined
  }

  // Wait for both the carousel and the page to stop, including touch momentum.
  const scheduleMenuSettlement = () => {
    const menu = menuRef.current
    if (!menu || menuTouchActive.current || menuScrollFrame.current !== undefined) return

    let previousLeft = menu.scrollLeft
    let previousTop = window.scrollY
    let stableSince: number | null = null
    const checkPosition = (now: number) => {
      if (menuTouchActive.current) {
        menuScrollFrame.current = undefined
        return
      }
      if (stableSince === null || Math.abs(menu.scrollLeft - previousLeft) > 0.1 || Math.abs(window.scrollY - previousTop) > 0.1) {
        previousLeft = menu.scrollLeft
        previousTop = window.scrollY
        stableSince = now
      }
      if (now - stableSince >= 150) {
        syncMenuCategory()
        return
      }
      menuScrollFrame.current = window.requestAnimationFrame(checkPosition)
    }
    menuScrollFrame.current = window.requestAnimationFrame(checkPosition)
  }

  const finishMenuTouch = (remainingTouches: number) => {
    menuTouchActive.current = remainingTouches > 0
    stopMenuSettlement()
    scheduleMenuSettlement()
  }

  const slideMenu = (index: number) => {
    const menu = menuRef.current
    const slide = menu?.children[index]
    if (!menu || !slide) return
    stopMenuSettlement()
    requestedCategory.current = index
    setMenuCategory(index)
    const left = menu.scrollLeft + slide.getBoundingClientRect().left - menu.getBoundingClientRect().left
    if (Math.abs(left - menu.scrollLeft) < 1) {
      menu.scrollTo({ left, behavior: 'instant' })
      scheduleMenuSettlement()
      return
    }
    menu.scrollTo({
      left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }
  return <div className={order.count ? 'site-shell has-order' : 'site-shell'}>
    <a className="skip-link" href="#top">Saltar para o conteúdo</a>
    <SiteHeader open={open} onOpenChange={setOpen} onStartOrder={() => setOrderOpen(true)} />
    <main id="top" tabIndex={-1} inert={open}>
      <section className="hero-section">
        <img className="hero-image" src={import.meta.env.BASE_URL + "bean-hero-clean.png"} alt="Bean Maputo takeaway coffee and bag" fetchPriority="high"/><div className="hero-shade"/>
        <div className="hero-content">
          <p className="eyebrow"><span/>Coffee memories in Maputo</p>
          <h1>Comece o seu dia bem<br/><em>logo ao amanhecer</em></h1>
          <p className="hero-copy"><em>Manhãs calmas, café honesto e o ritmo acolhedor da nossa cidade. Venha pelo café. Fique pela sensação.</em></p>
          <div className="hero-actions"><a className="button button-light" href="#menu">Explore o nosso menu<span></span></a><a className="text-link" href="#story">Descobra a nossa história <span></span></a></div>
        </div>
        <div className="hero-meta"><span>MAPUTO, MOÇAMBIQUE</span><span>822 AV. JULIUS NYERERE</span></div><a className="scroll-cue" href="#story" aria-label="Scroll to our story">↓</a>
      </section>
      <section className="manifesto" id="story">
        <p className="section-tag">Nossa filosofia</p><p className="manifesto-text">O café deve ser como um abraço quentinho em uma xícara.</p>
        <div className="principles">
          <article><strong>01</strong><div><h3>Localmente fundamentado</h3><p>Nascido em Maputo, moldado pelo seu calor, pelas suas cores e pela sua energia irresistível.</p></div></article>
          <article><strong>02</strong><div><h3>Cuidadosamente selecionado</h3><p>Grãos selecionados com cuidado, respeitando as pessoas e os lugares por trás de cada colheita.</p></div></article>
          <article><strong>03</strong><div><h3>Feito com intenção</h3><p>Cada xícara afinada com precisão e servida com a autêntica hospitalidade moçambicana.</p></div></article>
        </div>
      </section>
      <section className="menu-section" aria-labelledby="menu-title">
       <div className="menu-heading"><div><p className="section-tag light">O nosso menu</p><h2 id="menu-title">Menu enxuto.<br/><em>Grande personalidade.</em></h2></div><p>Favoritos da casa feitos com grãos cuidadosamente torrados e ingredientes que amamos.</p></div>
        <div className="menu-category-controls" id="menu" role="group" aria-label="Categorias do menu">
          {menuCategories.map((category, index) => <button
            key={category.id} type="button" aria-pressed={menuCategory === index}
            aria-controls={'menu-' + category.id} onClick={() => slideMenu(index)}
          >{category.name}</button>)}
        </div>
        <p className="menu-category-hint" id="menu-category-hint">Escolha uma categoria ou deslize. Adicione os seus favoritos ao pedido.</p>
        <div className="menu-categories" ref={menuRef} role="region" aria-label="Secções do menu" tabIndex={0}
          aria-describedby="menu-category-hint"
          onScroll={() => {
            if (requestedCategory.current === null) setMenuCategory(visibleMenuCategory())
            scheduleMenuSettlement()
          }}
          onScrollEnd={scheduleMenuSettlement}
          onTouchStart={() => {
            menuTouchActive.current = true
            requestedCategory.current = null
            stopMenuSettlement()
          }}
          onTouchEnd={event => finishMenuTouch(event.touches.length)}
          onTouchCancel={event => finishMenuTouch(event.touches.length)}
          onPointerDown={() => { requestedCategory.current = null }}
          onWheel={() => { requestedCategory.current = null }}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return
            let index = requestedCategory.current ?? menuCategory
            if (event.key === 'ArrowRight') index = Math.min(index + 1, menuCategories.length - 1)
            else if (event.key === 'ArrowLeft') index = Math.max(index - 1, 0)
            else if (event.key === 'Home') index = 0
            else if (event.key === 'End') index = menuCategories.length - 1
            else return
            event.preventDefault()
            slideMenu(index)
          }}>
          {menuCategories.map((category, index) => <section className="menu-category" data-active={menuCategory === index} aria-hidden={menuCategory !== index} inert={menuCategory !== index} id={'menu-' + category.id} key={category.id} aria-labelledby={'heading-' + category.id}>
            <h3 className="menu-category-title" id={'heading-' + category.id}>{category.name}</h3>
            {category.groups ? category.groups.map((group, index) => <section className="menu-subcategory" key={group.name} aria-labelledby={category.id + '-group-' + index}>
              <h4 className="menu-subcategory-title" id={category.id + '-group-' + index}>{group.name}</h4>
              <MenuItems items={group.items} quantities={order.quantities} onQuantityChange={order.setQuantity} />
            </section>) : <MenuItems items={category.items ?? []} quantities={order.quantities} onQuantityChange={order.setQuantity} />}
          </section>)}
        </div>
        <aside className="menu-notes" aria-labelledby="menu-notes-title">
          <h3 id="menu-notes-title">À sua medida</h3>
          <div className="menu-notes-content">
            <p>Alguns dos nossos pratos contêm ervas aromáticas, cebolinha, pimenta ou cebola roxa. <strong>Tem alguma alergia ou prefere evitar algum ingrediente?</strong> Por favor, informe o empregado de mesa antes de pedir.</p>
            <p className="menu-notes-extras"><span>Extras</span> Consulte os preços com o empregado de mesa antes de pedir.</p>
          </div>
        </aside>
        <button id="start-order" className="button button-gold order-start" type="button" onClick={() => setOrderOpen(true)}>{order.count ? 'Rever o pedido' : 'Fazer pedido'}</button>
      </section>
      <section className="visit-section" id="visit">
        <div><p className="section-tag">Venha dizer olá</p><h2>Uma boa xícara está<br/>mais perto do que você imagina.</h2></div>
<div className="visit-details"><div><span>Encontre-nos</span><p>822 Av. Julius Nyerere<br/>Maputo, Moçambique</p></div><div><span>Horário de funcionamento</span><p>Seg - Sex &nbsp; 07:00-18:00<br/>Sáb - Dom &nbsp; 08:00-16:00</p></div><div className="visit-map"><iframe title="Mapa da Bean Coffee Shop em Maputo" src={`https://maps.google.com/maps?q=${locationQuery}&z=17&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><a href={`https://www.google.com/maps/search/?api=1&query=${locationQuery}`} target="_blank" rel="noreferrer">Abrir no Google Maps</a></div></div>
      </section>
    </main>
<footer inert={open}><a href="#top"><Brand/></a><p>Bom café. Boa companhia. Maputo.</p><p>© 2026 Bean Maputo</p></footer>
    {order.count > 0 && <button className="order-cart-bar" type="button" inert={open} aria-haspopup="dialog" aria-label={`Ver pedido: ${order.count} ${order.count === 1 ? 'artigo' : 'artigos'}, ${formatMoney(order.total)}`} onClick={() => setOrderOpen(true)}>
      <span className="order-cart-count" aria-hidden="true">{order.count}</span><span>Ver pedido</span><strong>{formatMoney(order.total)}</strong>
    </button>}
    <p className="order-announcement" role="status">{order.count ? `${order.count} ${order.count === 1 ? 'artigo' : 'artigos'} no pedido. Total: ${formatMoney(order.total)}.` : 'O pedido está vazio.'}</p>
    <OrderDialog open={orderOpen} lines={order.lines} phone={orderPhone} onClose={() => setOrderOpen(false)} onBrowse={browseMenu} onQuantityChange={order.setQuantity} />
  </div>
}
