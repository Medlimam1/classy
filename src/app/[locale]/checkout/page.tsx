import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { useTranslations } from 'next-intl'
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
  const session = await getServerSession(authOptions)
  const t = useTranslations()

  if (!session?.user?.id) {
    redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/checkout`)
  }

  const cartSummary = await getCart(session.user.id)

  if (cartSummary.items.length === 0) {
    redirect(`/${params.locale}/cart`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('checkout.title')}
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <CheckoutForm locale={params.locale} />
        </div>

        {/* Order Summary */}
        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <CheckoutSummary 
            summary={cartSummary}
            locale={params.locale}
          />
        </div>
      </div>
    </div>
  )
}