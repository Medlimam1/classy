"use client"
import React from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import CartItems from '@/components/cart/CartItems'
import CartSummary from '@/components/cart/CartSummary'
import Link from 'next/link'

type CartItem = {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    inventory: number
  }
  variant?: {
    id: string
    name: string
    value: string
    price: number
  }
}

type CartSummary = {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  itemCount: number
}

export default function CartClient({ cartSummary, locale }: { cartSummary: CartSummary, locale: string }) {
  const t = useTranslations()
  // keep session hook for client behavior, value not used here
  useSession()

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
            href={`/${locale}/shop`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            <CartItems items={cartSummary.items} />
          </div>

          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <CartSummary 
              summary={cartSummary}
              locale={locale}
            />
          </div>
        </div>
      )}
    </div>
  )
}
