import { useEffect } from 'react'

export function useInitialHashScroll() {
  useEffect(() => {
    if (!window.location.hash) return

    let id: string
    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      return
    }

    // React can mount anchor targets after the browser's initial fragment lookup.
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])
}
