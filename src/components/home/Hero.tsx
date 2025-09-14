import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <section className="relative bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{t('hero.title')}</span>
                <span className="block text-amber-600 xl:inline">
                  {t('hero.subtitle')}
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {t('hero.description')}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href={`/${locale}/shop`}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    {t('hero.shopNow')}
                    {isRTL ? (
                      <ArrowLeft className="ml-2 -mr-1 h-5 w-5" />
                    ) : (
                      <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    )}
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3 rtl:sm:ml-0 rtl:sm:mr-3">
                  <Link
                    href={`/${locale}/about`}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    {t('common.learnMore')}
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 rtl:lg:right-auto rtl:lg:left-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/img/hero-image.jpg"
          alt={t('hero.imageAlt')}
        />
      </div>
    </section>
  )
}