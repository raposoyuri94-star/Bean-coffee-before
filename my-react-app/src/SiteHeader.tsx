import { useEffect, useRef, useState } from 'react'
import './SiteHeader.css'

export function Brand() {
  return <span className="brand">
    <span className="brand-mark"><img src={import.meta.env.BASE_URL + 'Bean Logo.jpg'} alt="" /></span>
    <span>BEAN <i>MAPUTO</i></span>
  </span>
}

type SiteHeaderProps = {
  page?: 'home' | 'gallery'
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartOrder?: () => void
}

type SectionId = 'story' | 'menu' | 'visit'

export default function SiteHeader({ page = 'home', open, onOpenChange, onStartOrder }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)
  const home = page === 'home' ? '' : import.meta.env.BASE_URL
  const close = () => onOpenChange(false)

  useEffect(() => {
    if (page !== 'home') return

    const sections: { id: SectionId; element: Element | null }[] = [
      { id: 'story', element: document.getElementById('story') },
      { id: 'menu', element: document.querySelector('.menu-section') },
      { id: 'visit', element: document.getElementById('visit') },
    ]
    let frame = 0
    const updateSection = () => {
      frame = 0
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0
      const marker = headerBottom + Math.min(window.innerHeight * 0.2, 160)
      let current: SectionId | null = null
      for (const { id, element } of sections) {
        if (element && element.getBoundingClientRect().top <= marker) current = id
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        current = 'visit'
      }
      setActiveSection(current)
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSection)
    }

    scheduleUpdate()
    if (open) return () => window.cancelAnimationFrame(frame)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('hashchange', scheduleUpdate)
    const observer = new ResizeObserver(scheduleUpdate)
    for (const { element } of sections) {
      if (element) observer.observe(element)
    }
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('hashchange', scheduleUpdate)
      observer.disconnect()
    }
  }, [page, open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const mobile = window.matchMedia('(max-width: 760px)')
    const handleResize = () => { if (!mobile.matches) onOpenChange(false) }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
        toggleRef.current?.focus({ preventScroll: true })
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
  }, [open, onOpenChange])

  return <header className="header" ref={headerRef}>
    <a href={home + '#top'} aria-label="Bean Maputo — página inicial" onClick={close}><Brand /></a>
    <div className="mobile-menu-actions">
      <a className="mobile-menu-link" href={home + '#menu'} onClick={close}>Menu</a>
      <button className="menu-toggle" ref={toggleRef} type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => onOpenChange(!open)}>
        <span /><span /><b>{open ? 'Fechar navegação' : 'Abrir navegação'}</b>
      </button>
    </div>
    <nav id="site-nav" className={open ? 'nav open' : 'nav'} aria-label="Navegação principal">
      <a href={home + '#story'} aria-current={page === 'home' && activeSection === 'story' ? 'location' : undefined} onClick={close}>Our story</a>
      <a href={home + '#menu'} aria-current={page === 'home' && activeSection === 'menu' ? 'location' : undefined} onClick={close}>Menu</a>
      <a href={import.meta.env.BASE_URL + 'galeria'} aria-current={page === 'gallery' ? 'page' : undefined} onClick={close}>Galeria</a>
      <a href={home + '#visit'} aria-current={page === 'home' && activeSection === 'visit' ? 'location' : undefined} onClick={close}>Visit us</a>
      {onStartOrder
        ? <button className="nav-cta" type="button" aria-haspopup="dialog" aria-controls="order-dialog" onClick={() => { close(); onStartOrder() }}>Fazer pedido</button>
        : <a className="nav-cta" href={home + '#menu'} onClick={close}>Fazer pedido</a>}
    </nav>
  </header>
}
