import '@/app/globals.css'

export default async function SimpleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const resolvedLocale = locale || 'en'

  return (
    <html lang={resolvedLocale} dir={resolvedLocale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}