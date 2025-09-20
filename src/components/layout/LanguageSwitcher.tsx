"use client"

import { useLocale } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  // translations not used here

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/'
    const qs = searchParams?.toString()
    const suffix = qs ? `?${qs}` : ''
    const newPath = `/${newLocale}${pathWithoutLocale}${suffix}`
    router.push(newPath)
  }

  return (
    <div className="relative group">
      <button
        onClick={() => compact ? switchLanguage(locale === 'ar' ? 'en' : 'ar') : undefined}
        className={`flex items-center gap-2 ${compact ? 'p-1' : 'px-3 py-2 text-sm font-medium'} text-gray-700 hover:text-gray-900 transition-colors`}
        aria-label="Switch language"
      >
        <Globe className={`${compact ? 'w-4 h-4' : 'w-4 h-4'}`} />
        {!compact && <span>{locale === 'ar' ? 'العربية' : 'English'}</span>}
      </button>

      {!compact && (
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
      )}
    </div>
  )
}