import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
// Do not import Prisma Product type directly to avoid Decimal typing issues in the UI layer
import { formatPrice } from '@/lib/utils'
import { Heart, ShoppingCart } from 'lucide-react'
import Pagination from '@/components/ui/Pagination'

interface ProductWithCategory {
  id: string
  name: string
  slug: string
  description?: string | null | undefined
  price: number | string | { toNumber?: () => number } | null
  comparePrice?: number | string | { toNumber?: () => number } | null | undefined
  images?: string[]
  inventory?: number | null | undefined
  category: {
    name: string
    slug: string
  }
}

interface ProductGridProps {
  products: ProductWithCategory[]
  currentPage: number
  totalPages: number
  totalCount: number
}

export default function ProductGrid({ 
  products, 
  currentPage, 
  totalPages, 
  totalCount 
}: ProductGridProps) {
  const t = useTranslations()
  const locale = useLocale()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          {t('shop.noProductsFound')}
        </div>
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors"
        >
          {t('shop.clearFilters')}
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
              <Image
                src={product.images?.[0] || `/images/placeholder-product.jpg`}
                alt={product.name}
                width={800}
                height={800}
                className="h-56 sm:h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              {product.comparePrice !== undefined && Number(product.comparePrice) > Number(product.price || 0) && (
                <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {Math.round(((Number(product.comparePrice) - Number(product.price || 0)) / Number(product.comparePrice)) * 100)}% {t('common.off')}
                  </span>
                </div>
              )}
              {Number(product.inventory || 0) <= 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium">{t('products.outOfStock')}</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-sm text-gray-500">
                    {product.category.name}
                  </h3>
                  <Link
                    href={`/${locale}/product/${product.slug}`}
                    className="mt-1 text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors"
                  >
                    {product.name}
                  </Link>
                  {product.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(Number(product.price), undefined, locale)}
                  </span>
                  {product.comparePrice !== undefined && Number(product.comparePrice) > Number(product.price || 0) && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(Number(product.comparePrice), undefined, locale)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {Number(product.inventory || 0) > 0 ? (
                    `${product.inventory} ${t('products.inStock')}`
                  ) : (
                    t('products.outOfStock')
                  )}
                </div>
              </div>

              <button 
                disabled={Number(product.inventory || 0) <= 0}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {Number(product.inventory || 0) > 0 ? t('products.addToCart') : t('products.outOfStock')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
          />
        </div>
      )}
    </div>
  )
}