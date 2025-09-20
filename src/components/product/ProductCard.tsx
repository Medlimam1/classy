"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Skeleton from '@/components/ui/Skeleton'

interface Product {
  id: string
  name: string
  nameAr: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  category?: {
    name: string
    nameAr: string
  }
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale()
  const t = useTranslations()
  const { data: session } = useSession()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const displayName = locale === 'ar' ? product.nameAr || product.name : product.name

  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 card-elevated">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Link href={`/${locale}/product/${product.slug}`} className="block relative w-full h-full"> 
            {!imgLoaded && <Skeleton className="w-full h-full" />}
            <Image
              src={product.images[0] || '/images/placeholder-product.jpg'}
              alt={product.nameAr}
              fill
              unoptimized
              onLoad={() => setImgLoaded(true)}
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${imgLoaded ? '' : 'opacity-0'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Wishlist Button */}
          <button className="absolute top-2 left-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>

          {/* Product Info */}
        <div className="p-4 text-sm sm:text-base lg:text-lg">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 mb-1 hidden md:block">
              {locale === 'ar' ? product.category.nameAr : product.category.name}
            </p>
          )}
          
          {/* Product Name */}
          <Link href={`/${locale}/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
              {displayName}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price, undefined, locale)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice, undefined, locale)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full"
            size="sm"
            onClick={async () => {
              if (!session) {
                // redirect to login with callback to cart
                router.push(`/${locale}/auth/login?callbackUrl=/${locale}/cart`)
                return
              }
              if (isAdding) return
              setIsAdding(true)
              try {
                const res = await fetch('/api/cart/add', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ productId: product.id, quantity: 1 }),
                })

                const data = await res.json().catch(() => null)
                if (!res.ok) {
                  toast.error(data?.error || t('cart.addError') || 'Failed to add to cart')
                } else {
                  try { window.dispatchEvent(new Event('cart:updated')) } catch { }
                  toast.success(t('cart.itemAdded') || 'Added to cart')
                }
              } catch {
                toast.error(t('cart.addError') || 'Failed to add to cart')
              } finally {
                setIsAdding(false)
              }
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdding ? '...' : (locale === 'ar' ? 'إضافة للسلة' : t('cart.addToCart') || 'Add to cart')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}