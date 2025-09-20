import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to default locale (use env DEFAULT_LOCALE or 'en')
  const defaultLocale = process.env.DEFAULT_LOCALE || 'en'
  redirect(`/${defaultLocale}`)
}