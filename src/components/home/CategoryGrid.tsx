'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

interface Category {
  id: string
  name: string
  nameAr: string
  slug: string
  _count: {
    products: number
  }
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const locale = useLocale()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            تسوق حسب الفئة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            استكشف مجموعاتنا المتنوعة من المنتجات عالية الجودة
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/shop?category=${category.slug}`}
              className="group"
            >
              <div className="text-center group cursor-pointer">
                <div className="bg-gray-100 rounded-lg p-8 mb-4 group-hover:bg-gray-200 transition-colors">
                  <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {category.nameAr.charAt(0)}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {category.nameAr}
                </h3>
                <p className="text-sm text-gray-500">
                  {category._count.products} منتج
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}