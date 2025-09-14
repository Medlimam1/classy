import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Cairo } from 'next/font/google'
import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '@/app/globals.css'

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  variable: '--font-cairo',
})

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
  const messages = await getMessages()
  const session = await getServerSession(authOptions)

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${cairo.variable} font-sans antialiased`}>
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster 
              position={locale === 'ar' ? 'bottom-left' : 'bottom-right'}
              richColors
            />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}