'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface CartSummary {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  itemCount: number
  items: any[]
}

interface CartSummaryProps {
  summary: CartSummary
  locale: string
}

export default function CartSummary({ summary, locale }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const t = useTranslations()

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)

    try {
      const response = await fetch('/api/cart/coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || t('cart.invalidCoupon'))
        return
      }

      toast.success(t('cart.couponApplied'))
      // Refresh the page to show updated cart
      window.location.reload()
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {t('cart.orderSummary')}
      </h2>

      {/* Coupon Code */}
      <div className="mb-6">
        <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
          {t('cart.couponCode')}
        </label>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <input
            type="text"
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder={t('cart.enterCoupon')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            onClick={applyCoupon}
            disabled={!couponCode.trim() || isApplyingCoupon}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplyingCoupon ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              t('common.apply')
            )}
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <div className="flex justify-between text-base text-gray-900">
          <span>{t('cart.subtotal')}</span>
          <span>{formatPrice(summary.subtotal, 'USD', locale)}</span>
        </div>

        {summary.discount > 0 && (
          <div className="flex justify-between text-base text-green-600">
            <span>{t('cart.discount')}</span>
            <span>-{formatPrice(summary.discount, 'USD', locale)}</span>
          </div>
        )}

        <div className="flex justify-between text-base text-gray-900">
          <span>{t('cart.shipping')}</span>
          <span>
            {summary.shipping === 0 
              ? t('cart.freeShipping') 
              : formatPrice(summary.shipping, 'USD', locale)
            }
          </span>
        </div>

        <div className="flex justify-between text-base text-gray-900">
          <span>{t('cart.tax')}</span>
          <span>{formatPrice(summary.tax, 'USD', locale)}</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>{t('cart.total')}</span>
            <span>{formatPrice(summary.total, 'USD', locale)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-6">
        <Link
          href={`/${locale}/checkout`}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors"
        >
          {t('cart.checkout')}
        </Link>
      </div>

      {/* Continue Shopping */}
      <div className="mt-4 text-center">
        <Link
          href={`/${locale}/shop`}
          className="text-sm text-amber-600 hover:text-amber-500"
        >
          {t('cart.continueShopping')}
        </Link>
      </div>

      {/* Order Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>{summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'} in cart</p>
      </div>
    </div>
  )
}