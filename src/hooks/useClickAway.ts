"use client"

import { useEffect, useRef, type RefObject } from 'react'
import { usePathname } from 'next/navigation'

type OnAway = () => void

/**
 * useClickAway
 * - returns a ref that you attach to a container holding a control (button) and a popup/menu
 * - calls `onAway` when clicking/touching outside, pressing Escape, scrolling, or when the pathname changes
 */
export default function useClickAway(onAway: OnAway): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    function handlePointer(e: MouseEvent | TouchEvent) {
      const el = ref.current
      if (!el) return
      const target = e.target as Node | null
      // If click is inside the ref container, ignore
      if (target && el.contains(target)) return
      // If click is inside a portal dropdown-panel (rendered outside the ref), ignore
      if (target instanceof Element) {
        const panel = target.closest('.dropdown-panel')
        if (panel) return
      }
      onAway()
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onAway()
    }

    function handleScroll() {
      onAway()
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', handleScroll)
    }
    // include pathname so route changes will retrigger effect and call onAway via cleanup/rehydration
  }, [onAway, pathname])

  return ref
}
