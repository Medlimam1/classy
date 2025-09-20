import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Product, Category } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import { Heart, ShoppingCart } from 'lucide-react'

interface ProductWithCategory extends Product {
  category: {
    name: string
    slug: string
  }
}

interface FeaturedProductsProps {
  products: ProductWithCategory[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('products.featured')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            {t('products.featuredSubtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                <img
                  src={product.images[0] || `/img/products/placeholder.jpg`}
                  alt={product.name}
                  className="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% {t('common.off')}
                    </span>
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
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price, undefined, locale)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.compareAtPrice, undefined, locale)}
                      </span>
                    )}
                  </div>
                </div>

                <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors">
                  <ShoppingCart className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('products.addToCart')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            {t('products.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}