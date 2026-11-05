import { useEffect, useRef, useState } from 'react'
import { Brand } from './SiteHeader'
import './SiteFooter.css'

type Notice = 'privacy' | 'terms'

export default function SiteFooter({ navigationOpen = false }: { navigationOpen?: boolean }) {
  const [notice, setNotice] = useState<Notice | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!notice || !dialog) return
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [notice])

  const openNotice = (next: Notice, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setNotice(next)
  }

  return (
    <>
      <footer className="site-footer" inert={navigationOpen}>
        <div className="footer-main">
          <a
            className="footer-home"
            href={import.meta.env.BASE_URL + '#top'}
            aria-label="Bean Maputo — página inicial"
          >
            <Brand />
          </a>
          <p>Bom café. Boa companhia. Maputo.</p>
          <p>© 2026 Bean Maputo. Todos os direitos reservados.</p>
        </div>
        <div className="footer-bottom">
          <nav className="footer-links" aria-label="Informações do site">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-controls="site-notice"
              onClick={(event) => openNotice('privacy', event.currentTarget)}
            >
              Privacidade
            </button>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-controls="site-notice"
              onClick={(event) => openNotice('terms', event.currentTarget)}
            >
              Termos de utilização
            </button>
          </nav>
          <p className="footer-credit">
            Made by <strong>Nexzoagency</strong>
          </p>
        </div>
      </footer>
      <dialog
        className="site-notice"
        id="site-notice"
        ref={dialogRef}
        aria-labelledby="site-notice-title"
        onClose={() => setNotice(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setNotice(null)
        }}
      >
        <div className="site-notice-heading">
          <h2 id="site-notice-title">{notice === 'privacy' ? 'Privacidade' : 'Termos de utilização'}</h2>
          <button
            className="site-notice-close"
            type="button"
            autoFocus
            aria-label="Fechar informação"
            onClick={() => setNotice(null)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="site-notice-copy">
          {notice === 'privacy' ? (
            <>
              <h3>A sua seleção</h3>
              <p>
                A seleção de itens e quantidades é guardada temporariamente nesta aba do navegador, para poder
                visitar a galeria ou recarregar a página sem perder o pedido. O nome e as observações não
                ficam guardados no armazenamento do navegador.
              </p>
              <h3>Pedidos pelo WhatsApp</h3>
              <p>
                Ao escolher “Continuar no WhatsApp”, os itens, as quantidades, o nome e as observações que
                preencher são incluídos no link que abre a conversa. Pode rever a mensagem antes de a enviar
                no WhatsApp.
              </p>
              <h3>Serviços externos</h3>
              <p>
                O site utiliza Google Maps para o mapa e Google Fonts para as fontes. Estes serviços e o
                WhatsApp têm as suas próprias políticas de privacidade, que pode consultar nos sites da{' '}
                <a
                  href="https://policies.google.com/privacy?hl=pt-PT"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google
                </a>{' '}
                e do{' '}
                <a
                  href="https://www.whatsapp.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <h3>Consultar e escolher</h3>
              <p>
                Este site permite consultar o menu e preparar uma mensagem com os itens que pretende pedir. O
                resumo apresenta a soma dos itens e quantidades selecionados.
              </p>
              <h3>Confirmar o pedido</h3>
              <p>
                Abrir o WhatsApp não envia nem confirma automaticamente o pedido. Envie a mensagem na conversa
                e confirme diretamente com o Bean a disponibilidade dos itens, o valor total e as condições do
                pedido.
              </p>
              <h3>Preferências e alergias</h3>
              <p>
                Pode usar as observações para indicar preferências. Se tiver alguma alergia ou precisar de
                evitar um ingrediente, informe o Bean antes de confirmar o pedido.
              </p>
            </>
          )}
        </div>
      </dialog>
    </>
  )
}
