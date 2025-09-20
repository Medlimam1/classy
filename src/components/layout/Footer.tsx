'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()

  const quickLinks = [
    { name: t('common.about'), href: `/${locale}/about` },
    { name: t('navigation.shop'), href: `/${locale}/shop` },
    { name: t('common.contact'), href: `/${locale}/contact` },
    { name: t('common.privacy'), href: `/${locale}/privacy` },
    { name: t('common.terms'), href: `/${locale}/terms` },
  ]

  const categories = [
    { name: t('categories.suits'), href: `/${locale}/shop?category=suits` },
    { name: t('categories.shirts'), href: `/${locale}/shop?category=shirts` },
    { name: t('categories.pants'), href: `/${locale}/shop?category=pants` },
    { name: t('categories.shoes'), href: `/${locale}/shop?category=shoes` },
    { name: t('categories.accessories'), href: `/${locale}/shop?category=accessories` },
  ]

  return (
    <footer className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="text-left rtl:text-right">
            <h3 className="text-2xl font-bold text-amber-400 mb-4">
              Classy Store
            </h3>
            <p className="text-gray-300 mb-4">
              {t('footer.aboutUs')} - {t('hero.subtitle')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse justify-start rtl:justify-end">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('navigation.categories')}</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('common.contact')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Nouakchott, Mauritania
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  +222 XX XX XX XX
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  info@classy.mr
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2">{t('footer.newsletter')}</h5>
              <p className="text-gray-400 text-xs mb-3">
                {t('footer.subscribeNewsletter')}
              </p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">{t('footer.enterEmail')}</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={t('footer.enterEmail')}
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-l-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  aria-label={t('footer.enterEmail')}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-r-md transition-colors"
                  aria-label={t('footer.subscribe')}
                >
                  {t('footer.subscribe')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Classy Store. {t('footer.allRightsReserved')}.
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">{t('footer.paymentMethods')}:</span>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-amber-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  B
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}