import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
// server-side pages load messages directly; do not use client hooks here
import { authOptions } from '@/lib/auth'
import { getCart } from '@/lib/cart'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import CheckoutSummary from '@/components/checkout/CheckoutSummary'

interface CheckoutPageProps {
  params: {
    locale: string
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  // Load messages for server-side rendering (avoid client hooks in server components)
  const base = locale.split('-')[0].toLowerCase()
  const messages = (await import(`@/messages/${base}.json`)).default
  const t = (key: string) => {
    return messages?.[key] ?? key
  }

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/checkout`)
  }

  const cartSummary = await getCart(session.user.id)

  if (cartSummary.items.length === 0) {
    redirect(`/${locale}/cart`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('checkout.title')}
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <CheckoutForm locale={locale} />
        </div>

        {/* Order Summary */}
        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <CheckoutSummary 
            summary={cartSummary}
            locale={locale}
          />
        </div>
      </div>
    </div>
  )
}