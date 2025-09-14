import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Category } from '@prisma/client'

interface CategoriesProps {
  categories: Category[]
}

export default function Categories({ categories }: CategoriesProps) {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('categories.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/shop?category=${category.slug}`}
              className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                <img
                  src={category.image || `/img/categories/${category.slug}.jpg`}
                  alt={category.name}
                  className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            {t('categories.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}