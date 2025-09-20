import { notFound } from 'next/navigation'
import getRequestConfig from '../../i18n/request'

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  // Next.js recommends awaiting params in dynamic routes
  const { locale } = (await params) as { locale?: string } ?? { locale: 'en' }
  const resolvedLocale = locale || 'en'
  const cfg = await getRequestConfig({ requestLocale: Promise.resolve(resolvedLocale) }).catch(() => null)
  const messages = cfg?.messages as Record<string, string> | null
  if (!messages) return notFound()

  const title = messages['privacy.title'] || 'Privacy Policy'

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-4">{messages['privacy.content'] || 'Privacy policy content goes here.'}</p>
    </main>
  )
}
