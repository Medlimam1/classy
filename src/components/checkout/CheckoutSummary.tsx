"use client"

import { useTranslations } from 'next-intl'
import { formatPrice } from '@/lib/utils'

interface CartSummary {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  itemCount: number
  items: Array<{
    id: string
    quantity: number
    product: {
      id: string
      name: string
      price: number
      images: string[]
    }
    variant?: {
      id: string
      name: string
      value: string
      price?: number
    }
  }>
}

interface CheckoutSummaryProps {
  summary: CartSummary
  locale: string
}

export default function CheckoutSummary({ summary, locale }: CheckoutSummaryProps) {
  const t = useTranslations()

  return (
    <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {t('checkout.orderSummary')}
      </h2>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {summary.items.map((item) => {
          const itemPrice = item.variant?.price || item.product.price
          const itemTotal = itemPrice * item.quantity

          return (
            <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <img
                  src={item.product.images[0] || '/img/products/placeholder.jpg'}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.product.name}
                </h3>
                {item.variant && (
                  <p className="text-xs text-gray-500">
                    {item.variant.name}: {item.variant.value}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {t('cart.quantity')}: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(itemTotal, undefined, locale)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('cart.subtotal')}</span>
          <span>{formatPrice(summary.subtotal, undefined, locale)}</span>
        </div>

        {summary.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{t('cart.discount')}</span>
            <span>-{formatPrice(summary.discount, undefined, locale)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('cart.shipping')}</span>
          <span>
            {summary.shipping === 0 
              ? t('cart.freeShipping') 
              : formatPrice(summary.shipping, undefined, locale)
            }
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('cart.tax')}</span>
          <span>{formatPrice(summary.tax, undefined, locale)}</span>
        </div>

        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>{t('cart.total')}</span>
            <span>{formatPrice(summary.total, undefined, locale)}</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t('checkout.secureCheckout')}
        </div>
      </div>
    </div>
  )
}