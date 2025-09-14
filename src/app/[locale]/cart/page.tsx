import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { useTranslations } from 'next-intl'
import { authOptions } from '@/lib/auth'
import { getCart } from '@/lib/cart'
import CartItems from '@/components/cart/CartItems'
import CartSummary from '@/components/cart/CartSummary'
import Link from 'next/link'

interface CartPageProps {
  params: {
    locale: string
  }
}

export default async function CartPage({ params }: CartPageProps) {
  const session = await getServerSession(authOptions)
  const t = useTranslations()

  if (!session?.user?.id) {
    redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/cart`)
  }

  const cartSummary = await getCart(session.user.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('cart.title')}
      </h1>

      {cartSummary.items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {t('cart.empty')}
          </div>
          <Link
            href={`/${params.locale}/shop`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <CartItems items={cartSummary.items} />
          </div>

          {/* Cart Summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <CartSummary 
              summary={cartSummary}
              locale={params.locale}
            />
          </div>
        </div>
      )}
    </div>
  )
}