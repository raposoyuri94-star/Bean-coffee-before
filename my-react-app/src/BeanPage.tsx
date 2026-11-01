import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInitialHashScroll } from './useInitialHashScroll'
import './BeanPage.css'



// Adicione itens como ['Nome', 'Descrição', 'Preço'] em items.
// Em cada secção, cada grupo tem a sua própria lista items.
type MenuGroup = { name: string; items: string[][] }
type MenuCategory = { id: string; name: string; items?: string[][]; groups?: MenuGroup[] }

const menuCategories: MenuCategory[] = [
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
      ['Balacate','', '180 MT'],
      ['Menta', '', '180 MT'],
      ['Matcha', '', '200 MT'],
      ['Ginger', '', '200 MT'],
    ] },
    { name: 'Chá de saqueta', items: [
      ['Rooibos','', '120 MT'],
      ['Verde', '', '180 MT'],
      ['Frutos vermelhos', '', '200 MT'],
    ] },

      { name: 'Bebidas frias', items: [
      ['Água pequena', '',  '100 MT'],
      ['Água das pedras', '', '150 MT'],
       ['Água das pedras', 'Tangerina, frutos vermelhos, limão', '150 MT'],
    ] },
    { name: 'Soft drinks', items: [
      ['Tónica zero', '',  '100 MT'],
      ['Sprite zero', '', '120 MT'],
      ['Coca-Cola Zero', '', '120 MT'],
    ] },
    ],
  },
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
]

const locationQuery = encodeURIComponent('822 Av. Julius Nyerere, Maputo, Mozambique')

function MenuItems({ items }: { items: string[][] }) {
  return <div className="menu-list">
    {items.length ? items.map((item, i) => <article className="menu-item" key={`${item[0]}-${item[1]}`}>
      <span className="item-number">{String(i + 1).padStart(2, '0')}</span>
      <div><h5>{item[0]}</h5>{item[1] && <p>{item[1]}</p>}</div>
      <strong>{item[2]}</strong>
    </article>) : <p className="menu-category-empty">Novidades em breve.</p>}
  </div>
}
function BeanIcon() {
  return <img src={import.meta.env.BASE_URL + "Bean Logo.jpg"} alt="" aria-hidden="true" />
}

function Brand() {
  return <span className="brand"><span className="brand-mark"><BeanIcon /></span><span>BEAN <i>MAPUTO</i></span></span>
}

export default function BeanPage() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuScrollTimeout = useRef<number | undefined>(undefined)
  const requestedCategory = useRef(0)
  const [menuCategory, setMenuCategory] = useState(0)
  useInitialHashScroll()

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const mobile = window.matchMedia('(max-width: 760px)')
    const handleResize = () => { if (!mobile.matches) setOpen(false) }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
      if (event.key === 'Tab') {
        const links = headerRef.current?.querySelectorAll<HTMLElement>('a, button')
        const first = links?.[0]
        const last = links?.[links.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    headerRef.current?.querySelector<HTMLElement>('.nav a')?.focus({ preventScroll: true })
    document.addEventListener('keydown', handleKeyDown)
    mobile.addEventListener('change', handleResize)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      mobile.removeEventListener('change', handleResize)
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(menuScrollTimeout.current), [])

  // Keep every slide laid out during a swipe, but reserve only the active slide's height.
  useLayoutEffect(() => {
    const menu = menuRef.current
    const slide = menu?.children[menuCategory]
    if (!menu || !slide) return

    let previousWidth = menu.clientWidth
    const updateLayout = () => {
      const scrollbarHeight = menu.offsetHeight - menu.clientHeight
      menu.style.height = `${Math.ceil(slide.getBoundingClientRect().height) + scrollbarHeight}px`
      if (menu.clientWidth !== previousWidth) {
        previousWidth = menu.clientWidth
        menu.scrollTo({
          left: menu.scrollLeft + slide.getBoundingClientRect().left - menu.getBoundingClientRect().left,
          behavior: 'instant',
        })
      }
    }
    updateLayout()
    const observer = new ResizeObserver(updateLayout)
    observer.observe(menu)
    observer.observe(slide)
    return () => observer.disconnect()
  }, [menuCategory])

  const syncMenuCategory = () => {
    window.clearTimeout(menuScrollTimeout.current)
    const menu = menuRef.current
    if (!menu) return
    const left = menu.getBoundingClientRect().left
    const distances = Array.from(menu.children, slide => Math.abs(slide.getBoundingClientRect().left - left))
    const index = distances.indexOf(Math.min(...distances))
    requestedCategory.current = index
    setMenuCategory(index)
  }

  const slideMenu = (index: number) => {
    const menu = menuRef.current
    const slide = menu?.children[index]
    if (!menu || !slide) return
    window.clearTimeout(menuScrollTimeout.current)
    requestedCategory.current = index
    menu.scrollTo({
      left: menu.scrollLeft + slide.getBoundingClientRect().left - menu.getBoundingClientRect().left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }
  return <div className="site-shell">
    <a className="skip-link" href="#top">Saltar para o conteúdo</a>
    <header className="header" ref={headerRef}>
      <a href="#top" aria-label="Bean Maputo — página inicial" onClick={close}><Brand /></a>
      <div className="mobile-menu-actions">
        <a className="mobile-menu-link" href="#menu" onClick={close}>Menu</a>
      <button className="menu-toggle" ref={toggleRef} type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}><span/><span/><b>{open ? 'Fechar navegação' : 'Abrir navegação'}</b></button>
      </div>
      <nav id="site-nav" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
        <a href="#story" onClick={close}>Our story</a><a href="#menu" onClick={close}>Menu</a><a href={import.meta.env.BASE_URL + "galeria"} onClick={close}>Galeria</a><a href="#visit" onClick={close}>Visit us</a><a className="nav-cta" href="#menu" onClick={close}>Fazer pedido</a>
      </nav>
    </header>
    <main id="top" tabIndex={-1} inert={open}>
      <section className="hero-section">
        <img className="hero-image" src={import.meta.env.BASE_URL + "bean-hero-clean.png"} alt="Bean Maputo takeaway coffee and bag" fetchPriority="high"/><div className="hero-shade"/>
        <div className="hero-content">
          <p className="eyebrow"><span/>Coffee memories in Maputo</p>
          <h1>Comece o seu dia bem<br/><em>logo ao amanhecer</em></h1>
          <p className="hero-copy"><em>Manhãs calmas, café honesto e o ritmo acolhedor da nossa cidade. Venha pelo café. Fique pela sensação.</em></p>
          <div className="hero-actions"><a className="button button-light" href="#menu">Explore o nosso menu<span></span></a><a className="text-link" href="#story">Descobra a nossa história <span></span></a></div>
        </div>
        <div className="hero-meta"><span>MAPUTO, MOÇAMBIQUE</span><span>-25.9644° S · 32.5992° E</span></div><a className="scroll-cue" href="#story" aria-label="Scroll to our story">↓</a>
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
        <p className="menu-category-hint" id="menu-category-hint">Escolha uma categoria ou deslize para explorar.</p>
        <div className="menu-categories" ref={menuRef} role="region" aria-label="Secções do menu" tabIndex={0}
          aria-describedby="menu-category-hint"
          onScroll={() => {
            window.clearTimeout(menuScrollTimeout.current)
            menuScrollTimeout.current = window.setTimeout(syncMenuCategory, 150)
          }}
          onScrollEnd={syncMenuCategory}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return
            let index = requestedCategory.current
            if (event.key === 'ArrowRight') index = Math.min(index + 1, menuCategories.length - 1)
            else if (event.key === 'ArrowLeft') index = Math.max(index - 1, 0)
            else if (event.key === 'Home') index = 0
            else if (event.key === 'End') index = menuCategories.length - 1
            else return
            event.preventDefault()
            slideMenu(index)
          }}>
          {menuCategories.map((category, index) => <section className="menu-category" data-active={menuCategory === index} aria-hidden={menuCategory !== index} id={'menu-' + category.id} key={category.id} aria-labelledby={'heading-' + category.id}>
            <h3 className="menu-category-title" id={'heading-' + category.id}>{category.name}</h3>
            {category.groups ? category.groups.map((group, index) => <section className="menu-subcategory" key={group.name} aria-labelledby={category.id + '-group-' + index}>
              <h4 className="menu-subcategory-title" id={category.id + '-group-' + index}>{group.name}</h4>
              <MenuItems items={group.items} />
            </section>) : <MenuItems items={category.items ?? []} />}
          </section>)}
        </div>
        <aside className="menu-notes" aria-labelledby="menu-notes-title">
          <h3 id="menu-notes-title">À sua medida</h3>
          <div className="menu-notes-content">
            <p>Alguns dos nossos pratos contêm ervas aromáticas, cebolinha, pimenta ou cebola roxa. <strong>Tem alguma alergia ou prefere evitar algum ingrediente?</strong> Por favor, informe o empregado de mesa antes de pedir.</p>
            <p className="menu-notes-extras"><span>Extras</span> Consulte os preços com o empregado de mesa antes de pedir.</p>
          </div>
        </aside>
        <a className="button button-gold" href="https://wa.me/258123456?text=Coffee%20order">Start an order</a>
      </section>
      <section className="visit-section" id="visit">
        <div><p className="section-tag">Venha dizer olá</p><h2>Uma boa xícara está<br/>mais perto do que você imagina.</h2></div>
<div className="visit-details"><div><span>Encontre-nos</span><p>822 Av. Julius Nyerere<br/>Maputo 0000, Mozambique</p></div><div><span>Horário de funcionamento</span><p>Seg - Sex &nbsp; 07:00-18:00<br/>Sáb - Dom &nbsp; 08:00-16:00</p></div><div className="visit-map"><iframe title="Mapa da Bean Coffee Shop em Maputo" src={`https://maps.google.com/maps?q=${locationQuery}&z=17&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><a href={`https://www.google.com/maps/search/?api=1&query=${locationQuery}`} target="_blank" rel="noreferrer">Abrir no Google Maps</a></div></div>
      </section>
    </main>
<footer inert={open}><a href="#top"><Brand/></a><p>Bom café. Boa companhia. Maputo.</p><p>© 2026 Bean Maputo</p></footer>
  </div>
}
