"use client"

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
// import logo from project root (file: "classy logo.webp")
import logo from '../../../classy logo.webp'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, User, Search, Heart } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import Portal from '../ui/Portal'
import useClickAway from '../../hooks/useClickAway'

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState<number>(0)
  const t = useTranslations()
  const locale = useLocale()
  const { data: session } = useSession()
  const [searchOpen, setSearchOpen] = useState(false)
  // ref for click-away handling: closes user menu
  const containerRef = useClickAway(() => {
    setIsUserMenuOpen(false)
  })

  useEffect(() => {
    // Lock when user menu open (mobile menus removed)
    if (isUserMenuOpen) {
      document.body.classList.add('lock-scroll')
    } else {
      document.body.classList.remove('lock-scroll')
    }
    return () => document.body.classList.remove('lock-scroll')
  }, [isUserMenuOpen])

  // Keep userButtonRef (not used for portal now but used for a11y focus handling)
  const userButtonRef = useRef<HTMLButtonElement | null>(null)
  const [userPanelStyle, setUserPanelStyle] = useState<React.CSSProperties | null>(null)

  // Header ref (kept for sticky header) - mobile panels are portaled into body
  const headerRef = useRef<HTMLElement | null>(null)

  const pathnameNav = usePathname()

  // No client-side positioning required for portaled menus; MobileMenu handles layout and locking.

  useEffect(() => {
    if (!isUserMenuOpen) {
      setUserPanelStyle(null)
      return
    }
    const btn = userButtonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const top = rect.bottom + window.scrollY + 6
    // place near right edge of button, clamp to 12px from right
    const right = Math.max(12, window.innerWidth - (rect.right + window.scrollX))
    setUserPanelStyle({ position: 'fixed', top: `${top}px`, right: `${right}px` })
    function onResize() {
      const current = userButtonRef.current
      if (!current) return
      const r = current.getBoundingClientRect()
      const t = r.bottom + window.scrollY + 6
      const ri = Math.max(12, window.innerWidth - (r.right + window.scrollX))
      setUserPanelStyle({ position: 'fixed', top: `${t}px`, right: `${ri}px` })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isUserMenuOpen])

  useEffect(() => {
    let mounted = true

    async function fetchCount() {
      try {
        const res = await fetch('/api/cart/count', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        if (mounted && typeof data.itemCount === 'number') {
          setCartCount(data.itemCount)
        }
      } catch (err) {
        console.error('Failed to fetch cart count', err)
      }
    }

    fetchCount()

    function onCartUpdated() {
      // Re-fetch count when cart updated elsewhere
      fetchCount()
    }

    window.addEventListener('cart:updated', onCartUpdated)

    return () => {
      mounted = false
      window.removeEventListener('cart:updated', onCartUpdated)
    }
  }, [session])

  const navigation = [
    { name: t('navigation.shop'), href: `/${locale}/shop` },
    { name: t('navigation.categories'), href: `/${locale}/categories` },
    { name: t('common.about'), href: `/${locale}/about` },
    { name: t('common.contact'), href: `/${locale}/contact` },
  ]

  useEffect(() => {
    // close user menu on route change
    setIsUserMenuOpen(false)
  }, [pathnameNav])

  return (
    <header ref={headerRef} className="bg-white shadow-sm border-b sticky top-0 z-50 no-clip">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <Image src={logo} alt="Classy Store" width={44} height={44} className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold text-amber-700 hidden sm:inline">Classy Store</span>
            </Link>
          </div>

          {/* Navigation (visible on all sizes) -- keep on one line on small screens */}
          <nav className="flex gap-3 rtl:space-x-reverse items-center whitespace-nowrap overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-3 rtl:space-x-reverse">
            {/* Search */}
            <div className="relative hidden md:block">
              <button
                aria-label={t('common.search')}
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-700 hover:text-amber-700 p-2"
              >
                <Search className="h-5 w-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg p-3 z-50">
                  <label htmlFor="site-search" className="sr-only">{t('common.search')}</label>
                  <input
                    id="site-search"
                    placeholder={t('common.searchPlaceholder')}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value
                        if (value.trim()) location.href = `/${locale}/shop?search=${encodeURIComponent(value)}`
                      }
                    }}
                  />
                </div>
              )}
            </div>


            {/* Wishlist */}
            {session && (
              <Link
                href={`/${locale}/wishlist`}
                className="text-gray-700 hover:text-amber-700 p-2 relative hidden md:inline"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {/* User + controls grouped */}
            <div ref={containerRef} className="relative flex items-center">
              {/* cart (single) */}
              <Link
                href={`/${locale}/cart`}
                className="text-gray-700 hover:text-amber-700 p-2 relative"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" aria-live="polite">
                  {cartCount}
                </span>
              </Link>

              {/* User Menu Button */}
              <button
                ref={userButtonRef}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-700 hover:text-amber-700 p-2"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
              >
                <User className="h-5 w-5" />
              </button>

              {/* user dropdown portaled so it always sits above other content */}
              {isUserMenuOpen && userPanelStyle && (
                <Portal>
                  <div style={userPanelStyle} className="dropdown-panel" role="menu">
                    {session ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          {session.user.name || session.user.email}
                        </div>
                        <Link href={`/${locale}/account`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>{t('navigation.account')}</Link>
                        <Link href={`/${locale}/orders`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>{t('navigation.orders')}</Link>
                        {session.user.role === 'ADMIN' && (
                          <Link href={`/${locale}/admin`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>{t('navigation.admin')}</Link>
                        )}
                        <button onClick={() => { signOut(); setIsUserMenuOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('navigation.logout')}</button>
                      </>
                    ) : (
                      <>
                        <Link href={`/${locale}/auth/login`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>{t('navigation.login')}</Link>
                        <Link href={`/${locale}/auth/register`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>{t('navigation.register')}</Link>
                      </>
                    )}
                  </div>
                </Portal>
              )}

              {/* compact language at the far right (single instance) */}
              <div className="ml-2"><LanguageSwitcher compact /></div>
            </div>
            {/* overlay - covers the page and prevents interaction; overlay click closes menus */}
            {isUserMenuOpen && (
              <div
                className="dropdown-overlay"
                onClick={() => {
                  setIsUserMenuOpen(false)
                }}
              />
            )}
          </div>
        </div>

        {/* mobile nav is rendered inside the click-away container above */}
      </div>
    </header>
  )
}