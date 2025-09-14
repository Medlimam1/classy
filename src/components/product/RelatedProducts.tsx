import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: string[]
  inventory: number
  category: {
    name: string
    slug: string
  }
}

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations()
  const locale = useLocale()

  if (products.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('products.relatedProducts')}
      </h2>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
              <img
                src={product.images[0] || `/img/products/placeholder.jpg`}
                alt={product.name}
                className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% {t('common.off')}
                  </span>
                </div>
              )}
              {product.inventory <= 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium">{t('products.outOfStock')}</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xs text-gray-500">
                    {product.category.name}
                  </h3>
                  <Link
                    href={`/${locale}/product/${product.slug}`}
                    className="mt-1 text-sm font-medium text-gray-900 hover:text-amber-600 transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(product.price, 'USD', locale)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice, 'USD', locale)}
                    </span>
                  )}
                </div>
              </div>

              <button 
                disabled={product.inventory <= 0}
                className="mt-3 w-full flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                {product.inventory > 0 ? t('products.addToCart') : t('products.outOfStock')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}