'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    // Add new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
        <Globe className="w-4 h-4" />
        <span>{locale === 'ar' ? 'العربية' : 'English'}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          <button
            onClick={() => switchLanguage('ar')}
            className={`block w-full text-right px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
              locale === 'ar' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => switchLanguage('en')}
            className={`block w-full text-right px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
              locale === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </div>
  )
}