'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart } from 'lucide-react'

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
  
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Link href={`/${locale}/products/${product.slug}`}>
            <Image
              src={product.images[0] || '/images/placeholder-product.svg'}
              alt={product.nameAr}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 mb-1">
              {product.category.nameAr}
            </p>
          )}
          
          {/* Product Name */}
          <Link href={`/${locale}/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
              {product.nameAr}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {product.price.toLocaleString()} أوقية
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.comparePrice.toLocaleString()} أوقية
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            إضافة للسلة
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}