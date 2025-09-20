import { notFound } from 'next/navigation'
import getRequestConfig from '../../i18n/request'

export default async function TermsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'en'
  const cfg = await getRequestConfig(({ locale } as any)).catch(() => null)
  const messages = cfg?.messages as Record<string, string> | null
  if (!messages) return notFound()

  const title = messages['terms.title'] || 'Terms and Conditions'

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-4">{messages['terms.content'] || 'Terms content goes here.'}</p>
    </main>
  )
}
