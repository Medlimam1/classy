'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, User, Menu, X, Search, Heart } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const { data: session } = useSession()

  const navigation = [
    { name: t('navigation.shop'), href: `/${locale}/shop` },
    { name: t('navigation.categories'), href: `/${locale}/categories` },
    { name: t('common.about'), href: `/${locale}/about` },
    { name: t('common.contact'), href: `/${locale}/contact` },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`} className="text-2xl font-bold text-amber-700">
              Classy Store
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
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
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Search */}
            <button className="text-gray-700 hover:text-amber-700 p-2">
              <Search className="h-5 w-5" />
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Wishlist */}
            {session && (
              <Link
                href={`/${locale}/wishlist`}
                className="text-gray-700 hover:text-amber-700 p-2 relative"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="text-gray-700 hover:text-amber-700 p-2 relative"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-700 hover:text-amber-700 p-2"
              >
                <User className="h-5 w-5" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {session.user.name || session.user.email}
                      </div>
                      <Link
                        href={`/${locale}/account`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t('navigation.account')}
                      </Link>
                      <Link
                        href={`/${locale}/orders`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t('navigation.orders')}
                      </Link>
                      {session.user.role === 'ADMIN' && (
                        <Link
                          href={`/${locale}/admin`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t('navigation.admin')}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut()
                          setIsUserMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('navigation.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/${locale}/auth/login`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t('navigation.login')}
                      </Link>
                      <Link
                        href={`/${locale}/auth/register`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t('navigation.register')}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-amber-700 p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-amber-700 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}