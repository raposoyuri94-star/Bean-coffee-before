import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BeanPage from './BeanPage.tsx'
import GalleryPage from './GalleryPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname.replace(/\/+$/, '') === import.meta.env.BASE_URL.replace(/\/+$/, '') + '/galeria' ? <GalleryPage /> : <BeanPage />}
  </StrictMode>,
)
