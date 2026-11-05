import { useEffect, useRef, useState } from 'react'
import SiteHeader from './SiteHeader'
import { useInitialHashScroll } from './useInitialHashScroll'
import './GalleryPage.css'

// Add new photos to public and list their paths and Portuguese captions here.
const photos = [
  {
    src: import.meta.env.BASE_URL + 'bean-photo-0-enhanced.webp',
    width: 1093,
    height: 1438,
    alt: 'Café num copo de vidro com chantilly e grãos de café sobre um prato de madeira',
    title: 'Uma pausa mais doce.',
    caption: 'Café e pequenos prazeres para saborear sem pressa.',
    label: '01 / SABORES',
  },
  {
    src: import.meta.env.BASE_URL + 'bean-photo-1-enhanced.webp',
    width: 1082,
    height: 1454,
    alt: 'Duas pessoas seguram bebidas verdes sobre uma mesa de madeira',
    title: 'Melhor em boa companhia.',
    caption: 'Dois sabores, uma mesa e tempo para conversar.',
    label: '02 / PARTILHA',
  },
  {
    src: import.meta.env.BASE_URL + 'bean-photo-2-enhanced.webp',
    width: 1081,
    height: 1455,
    alt: 'Café com desenho de um gato na espuma, colher e prato de madeira',
    title: 'Arte em cada chávena.',
    caption: 'Os pequenos detalhes tornam a pausa especial.',
    label: '03 / DETALHES',
  },
  {
    src: import.meta.env.BASE_URL + 'bean-photo-3-enhanced.webp',
    width: 1095,
    height: 1437,
    alt: 'Balcão Bean com máquina de café, chávenas e prateleiras iluminadas',
    title: 'O nosso cantinho.',
    caption: 'Um espaço acolhedor para o seu próximo café.',
    label: '04 / O NOSSO ESPAÇO',
  },
  {
    src: import.meta.env.BASE_URL + 'bean-cafe-enhanced.webp',
    width: 1536,
    height: 1024,
    alt: 'Entrada do Bean com placa da marca, plantas suspensas e balcão de café',
    title: 'Entre e sinta-se em casa.',
    caption: 'Um recanto verde para saborear o seu café.',
    label: '05 / BEM-VINDO',
    landscape: true,
  },
  {
    src: import.meta.env.BASE_URL + 'bean-team-enhanced.webp',
    width: 1536,
    height: 1024,
    alt: 'Quatro membros da equipa Bean à entrada do café',
    title: 'Quem dá vida ao Bean.',
    caption: 'A nossa equipa, sempre pronta para receber.',
    label: '06 / A NOSSA EQUIPA',
    landscape: true,
  },
]

export default function GalleryPage() {
  const [selected, setSelected] = useState(0)
  const [enlarged, setEnlarged] = useState(false)
  const [navigationOpen, setNavigationOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  useInitialHashScroll()

  useEffect(() => {
    const previousTitle = document.title
    const previousLanguage = document.documentElement.lang
    document.title = 'Galeria | Bean Maputo'
    document.documentElement.lang = 'pt-MZ'
    return () => {
      document.title = previousTitle
      document.documentElement.lang = previousLanguage
    }
  }, [])

  useEffect(() => {
    if (!enlarged) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [enlarged])

  const enlarge = (index: number) => {
    setSelected(index)
    dialog.current?.showModal()
    setEnlarged(true)
  }
  const close = () => dialog.current?.close()

  return (
    <div className="site-shell gallery-page" lang="pt-MZ">
      <a className="skip-link" href="#gallery-main">
        Saltar para o conteúdo
      </a>
      <SiteHeader page="gallery" open={navigationOpen} onOpenChange={setNavigationOpen} />
      <main id="gallery-main" tabIndex={-1} inert={navigationOpen}>
        <section className="gallery-intro" aria-labelledby="gallery-title">
          <p className="section-tag">O NOSSO ÁLBUM / MAPUTO</p>
          <h1 id="gallery-title">
            Pequenos momentos.
            <br />
            <em>Boas memórias.</em>
          </h1>
          <div className="gallery-intro-bottom">
            <p>Um olhar sobre o universo Bean. Café, detalhes e momentos que apetece guardar.</p>
          </div>
        </section>
        <section className="gallery-grid" id="fotografias" aria-label="Fotografias Bean">
          {photos.map((photo, index) => (
            <figure
              className={photo.landscape ? 'gallery-card gallery-card-landscape' : 'gallery-card'}
              key={photo.src}
            >
              <button
                className="gallery-photo"
                type="button"
                onClick={() => enlarge(index)}
                aria-label={`Ampliar fotografia: ${photo.title}`}
              >
                <img
                  src={photo.src}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <span className="gallery-expand" aria-hidden="true">
                  Ampliar
                </span>
              </button>
              <figcaption>
                <span className="gallery-label">{photo.label}</span>
                <h2>{photo.title}</h2>
                <p>{photo.caption}</p>
              </figcaption>
            </figure>
          ))}
        </section>
        <section className="gallery-invitation">
          <p className="section-tag">DA FOTOGRAFIA À SUA PRÓXIMA PAUSA</p>
          <h2>
            O próximo momento
            <br />
            <em>pode ser seu.</em>
          </h2>
          <a className="button button-gold" href={import.meta.env.BASE_URL + '#visit'}>
            Venha conhecer-nos{' '}
          </a>
        </section>
      </main>
      <footer inert={navigationOpen}>
        <a href={import.meta.env.BASE_URL + ''}>BEAN MAPUTO</a>
        <p>Bom café. Boa companhia. Maputo.</p>
        <p>© 2026 Bean Maputo</p>
      </footer>
      <dialog
        className="gallery-dialog"
        ref={dialog}
        aria-label="Fotografia ampliada"
        onClose={() => setEnlarged(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
      >
        <div className="gallery-dialog-content">
          <button className="gallery-close" type="button" onClick={close} autoFocus>
            Fechar ×
          </button>
          <img src={photos[selected].src} alt={photos[selected].alt} />
          <p>{photos[selected].title}</p>
          <div className="gallery-dialog-controls">
            <button type="button" onClick={() => setSelected((selected + photos.length - 1) % photos.length)}>
              ← Anterior
            </button>
            <span aria-live="polite">
              {selected + 1} / {photos.length}
            </span>
            <button type="button" onClick={() => setSelected((selected + 1) % photos.length)}>
              Seguinte →
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
