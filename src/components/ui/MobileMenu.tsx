'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Portal from './Portal'
import { useBodyLock } from '../../hooks/useBodyLock'

type Item = { label: string; href?: string; onClick?: () => void }

export default function MobileMenu({
  open,
  onClose,
  items,
  withLanguage = true,
}: {
  open: boolean
  onClose: () => void
  items: Item[]
  withLanguage?: boolean
}) {
  const locale = (useLocale?.() as string) || 'en'
  const pathname = usePathname() || '/'
  const searchParams = useSearchParams()
  const router = useRouter()
  const isRTL = locale === 'ar' || String(locale).startsWith('ar')

  useBodyLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function switchLocale(target: 'ar' | 'en') {
    // keep path and query
    const params = new URLSearchParams(Array.from(searchParams || []))
    const paramsStr = params.toString() ? '?' + params.toString() : ''
    const base = pathname.replace(/^\/(ar|en)(?=\/|$)/, '') || ''
    router.push(`/${target}${base}${paramsStr}`)
    onClose()
  }

  if (!open) return null

  return (
    <Portal>
      <button
        aria-label="Overlay"
        className="fixed inset-0 z-[999] bg-black/0"
        onClick={onClose}
      />

      <div
        role="menu"
        aria-label="Mobile menu"
        className={`fixed z-[1000] w-[min(88vw,20rem)] max-w-[calc(100vw-1rem)] left-1/2 -translate-x-1/2 top-[calc(56px+env(safe-area-inset-top))] max-h-[78vh] overflow-auto rounded-2xl border border-gray-200 bg-white shadow-2xl p-2 ${isRTL ? 'rtl' : ''}`}
      >
        <div className="flex flex-col">
          {items.map((it, i) =>
            it.href ? (
              <Link
                key={i}
                href={it.href}
                className="block px-3 py-2 rounded-lg text-[15px] text-gray-900 hover:bg-gray-50"
                onClick={onClose}
              >
                {it.label}
              </Link>
            ) : (
              <button
                key={i}
                type="button"
                className="text-left block px-3 py-2 rounded-lg text-[15px] text-gray-900 hover:bg-gray-50"
                onClick={() => {
                  it.onClick?.()
                  onClose()
                }}
              >
                {it.label}
              </button>
            )
          )}

          {withLanguage && (
            <>
              <div className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-500">Language</div>
              <button className="text-left block px-3 py-2 rounded-lg text-[15px] hover:bg-gray-50" onClick={() => switchLocale('ar')}>العربية</button>
              <button className="text-left block px-3 py-2 rounded-lg text-[15px] hover:bg-gray-50" onClick={() => switchLocale('en')}>English</button>
            </>
          )}
        </div>
      </div>
    </Portal>
  )
}
