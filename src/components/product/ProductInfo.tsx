'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { Product, ProductVariant } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import { Heart, ShoppingCart, Minus, Plus, Star } from 'lucide-react'
import { toast } from 'sonner'

interface ProductWithVariants extends Product {
  variants: ProductVariant[]
  reviews: any[]
}

interface ProductInfoProps {
  product: ProductWithVariants
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)

  const { data: session } = useSession()
  const t = useTranslations()
  const locale = useLocale()

  // Calculate average rating
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  // Get current price based on selected variant
  const currentPrice = selectedVariant 
    ? product.variants.find(v => v.id === selectedVariant)?.price || product.price
    : product.price

  const handleAddToCart = async () => {
    if (!session) {
      toast.error(t('auth.loginRequired'))
      return
    }

    setIsAddingToCart(true)
    
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant,
          quantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      toast.success(t('cart.itemAdded'))
    } catch (error) {
      toast.error(t('cart.addError'))
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!session) {
      toast.error(t('auth.loginRequired'))
      return
    }

    setIsAddingToWishlist(true)
    
    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to wishlist')
      }

      toast.success(t('wishlist.itemAdded'))
    } catch (error) {
      toast.error(t('wishlist.addError'))
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.inventory) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Group variants by type
  const variantsByType = product.variants.reduce((acc, variant) => {
    if (!acc[variant.name]) {
      acc[variant.name] = []
    }
    acc[variant.name].push(variant)
    return acc
  }, {} as Record<string, ProductVariant[]>)

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {product.name}
      </h1>

      {/* Rating */}
      {product.reviews.length > 0 && (
        <div className="mt-3 flex items-center">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <Star
                key={rating}
                className={`h-5 w-5 flex-shrink-0 ${
                  averageRating > rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="ml-3 rtl:ml-0 rtl:mr-3 text-sm text-gray-700">
            {averageRating.toFixed(1)} ({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})
          </p>
        </div>
      )}

      {/* Price */}
      <div className="mt-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <p className="text-3xl font-bold text-gray-900">
            {formatPrice(currentPrice, 'USD', locale)}
          </p>
          {product.compareAtPrice && product.compareAtPrice > currentPrice && (
            <p className="text-xl text-gray-500 line-through">
              {formatPrice(product.compareAtPrice, 'USD', locale)}
            </p>
          )}
        </div>
        {product.compareAtPrice && product.compareAtPrice > currentPrice && (
          <p className="mt-1 text-sm text-green-600">
            {t('products.save')} {formatPrice(product.compareAtPrice - currentPrice, 'USD', locale)} 
            ({Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100)}%)
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="mt-4">
        {product.inventory > 0 ? (
          <p className="text-green-600 text-sm">
            ✓ {product.inventory} {t('products.inStock')}
          </p>
        ) : (
          <p className="text-red-600 text-sm">
            ✗ {t('products.outOfStock')}
          </p>
        )}
      </div>

      {/* Variants */}
      {Object.keys(variantsByType).length > 0 && (
        <div className="mt-6">
          {Object.entries(variantsByType).map(([variantType, variants]) => (
            <div key={variantType} className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {variantType}
              </h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                      selectedVariant === variant.id
                        ? 'border-amber-600 bg-amber-50 text-amber-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {variant.value}
                    {variant.price && variant.price !== product.price && (
                      <span className="ml-2 rtl:ml-0 rtl:mr-2 text-xs">
                        +{formatPrice(variant.price - product.price, 'USD', locale)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {t('cart.quantity')}
        </h3>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-center min-w-[3rem]">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= product.inventory}
              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {t('products.maxQuantity')}: {product.inventory}
          </span>
        </div>
      </div>

      {/* Add to Cart & Wishlist */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={product.inventory <= 0 || isAddingToCart}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isAddingToCart ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {product.inventory > 0 ? t('products.addToCart') : t('products.outOfStock')}
            </>
          )}
        </button>
        
        {session && (
          <button
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAddingToWishlist ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <>
                <Heart className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('products.addToWishlist')}
              </>
            )}
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <div className="space-y-4">
          {product.sku && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('admin.sku')}:</span>
              <span className="text-gray-900">{product.sku}</span>
            </div>
          )}
          {product.weight && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('admin.weight')}:</span>
              <span className="text-gray-900">{product.weight}g</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}