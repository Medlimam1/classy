'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface CartItem {
  id: string
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

interface CartItemsProps {
  items: CartItem[]
}

export default function CartItems({ items }: CartItemsProps) {
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const t = useTranslations()
  const locale = useLocale()

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItems(prev => new Set(prev).add(itemId))

    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          quantity: newQuantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update cart')
      }

      // Refresh the page to show updated cart
      window.location.reload()
    } catch (error) {
      toast.error(t('cart.updateError'))
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))

    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove item')
      }

      toast.success(t('cart.itemRemoved'))
      // Refresh the page to show updated cart
      window.location.reload()
    } catch (error) {
      toast.error(t('cart.removeError'))
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const isUpdating = updatingItems.has(item.id)
        const itemPrice = item.variant?.price || item.product.price
        const itemTotal = itemPrice * item.quantity

        return (
          <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse bg-white p-6 rounded-lg shadow-sm border">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={item.product.images[0] || '/img/products/placeholder.jpg'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900">
                {item.product.name}
              </h3>
              {item.variant && (
                <p className="text-sm text-gray-500">
                  {item.variant.name}: {item.variant.value}
                </p>
              )}
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {formatPrice(itemPrice, 'USD', locale)}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-center min-w-[3rem] border border-gray-300 rounded-md">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.inventory || isUpdating}
                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(itemTotal, 'USD', locale)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.id)}
              disabled={isUpdating}
              className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}