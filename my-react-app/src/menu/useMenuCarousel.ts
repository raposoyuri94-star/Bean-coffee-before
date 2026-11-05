import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { HTMLAttributes } from 'react'

// Keep layout changes separate from touch scrolling: shrinking a long slide mid-swipe
// lets iOS clamp the document position and can send the customer into the map.
export function useMenuCarousel(categoryCount: number) {
  const menuRef = useRef<HTMLDivElement>(null)
  const menuScrollFrame = useRef<number | undefined>(undefined)
  const menuTouchActive = useRef(false)
  const requestedCategory = useRef<number | null>(null)
  const [menuCategory, setMenuCategory] = useState(0)
  const [settledMenuCategory, setSettledMenuCategory] = useState(0)

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
    const distances = Array.from(menu.children, (slide) =>
      Math.abs(slide.getBoundingClientRect().left - left)
    )
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
      if (
        stableSince === null ||
        Math.abs(menu.scrollLeft - previousLeft) > 0.1 ||
        Math.abs(window.scrollY - previousTop) > 0.1
      ) {
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

  const events: HTMLAttributes<HTMLDivElement> = {
    onScroll: () => {
      if (requestedCategory.current === null) setMenuCategory(visibleMenuCategory())
      scheduleMenuSettlement()
    },
    onScrollEnd: scheduleMenuSettlement,
    onTouchStart: () => {
      menuTouchActive.current = true
      requestedCategory.current = null
      stopMenuSettlement()
    },
    onTouchEnd: (event) => finishMenuTouch(event.touches.length),
    onTouchCancel: (event) => finishMenuTouch(event.touches.length),
    onPointerDown: () => {
      requestedCategory.current = null
    },
    onWheel: () => {
      requestedCategory.current = null
    },
    onKeyDown: (event) => {
      if (event.target !== event.currentTarget) return
      let index = requestedCategory.current ?? menuCategory
      if (event.key === 'ArrowRight') index = Math.min(index + 1, categoryCount - 1)
      else if (event.key === 'ArrowLeft') index = Math.max(index - 1, 0)
      else if (event.key === 'Home') index = 0
      else if (event.key === 'End') index = categoryCount - 1
      else return
      event.preventDefault()
      slideMenu(index)
    },
  }
  return { menuRef, activeCategory: menuCategory, slideMenu, events }
}
