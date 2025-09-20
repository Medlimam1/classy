'use client';
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Portal({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<Element | null>(null)
  useEffect(() => {
    setEl(document.body)
  }, [])
  if (!el) return null
  return createPortal(children, el)
}
