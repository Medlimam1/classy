// layout wraps the app and delegates providers to the client-side Providers component
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import '@/app/globals.css'


export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Debug log to trace locale value
  console.log('[locale layout] params.locale:', locale)

  // Load messages directly based on the locale segment to avoid relying on next-intl server helper
  let messages: Record<string, unknown>
  try {
    const resolvedLocale = (locale as string) || 'en'
    const base = resolvedLocale.split('-')[0].toLowerCase()
    if (!['ar', 'en'].includes(base)) {
      console.log('[locale layout] unsupported locale segment:', base, 'falling back to en')
      // fallback to English if unsupported
      messages = (await import(`../messages/en.json`)).default
    } else {
      messages = (await import(`../messages/${base}.json`)).default
    }
    console.log('[locale layout] loaded messages for', base)
    // debug: print cart keys to ensure required translations are present
    try {
      // eslint-disable-next-line no-console
      console.log('[locale layout] messages.cart keys:', Object.keys((messages as any).cart || {}))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('[locale layout] messages.cart inspection failed', e)
    }
  } catch (e) {
    console.error('[locale layout] failed to load messages for', locale, e)
    // If we cannot load messages, render 404
    // Using next/navigation notFound would be better, but keep layout synchronous handling
    throw e
  }
  const session = await getServerSession(authOptions)

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Providers is a client component that wraps SessionProvider and NextIntlClientProvider */}
      <Providers session={session} messages={messages} locale={locale}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </Providers>
    </div>
  )
}