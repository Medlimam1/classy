'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Category } from '@prisma/client'
import { Filter, X } from 'lucide-react'

interface ProductFiltersProps {
  categories: Category[]
  currentFilters: {
    q?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
    page: number
    limit: number
  }
}

export default function ProductFilters({ categories, currentFilters }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice?.toString() || '')
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice?.toString() || '')
  
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to first page when filters change
    params.set('page', '1')
    
    router.push(`/${locale}/shop?${params.toString()}`)
  }

  const handleCategoryChange = (categorySlug: string) => {
    updateFilters({
      category: currentFilters.category === categorySlug ? undefined : categorySlug
    })
  }

  const handlePriceFilter = () => {
    updateFilters({
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    })
  }

  const handleSortChange = (sort: string) => {
    updateFilters({ sort })
  }

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    router.push(`/${locale}/shop`)
  }

  const sortOptions = [
    { value: 'newest', label: t('shop.sortNewest') },
    { value: 'oldest', label: t('shop.sortOldest') },
    { value: 'price-asc', label: t('shop.sortPriceLowHigh') },
    { value: 'price-desc', label: t('shop.sortPriceHighLow') },
    { value: 'name-asc', label: t('shop.sortNameAZ') },
    { value: 'name-desc', label: t('shop.sortNameZA') },
  ]

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Filter className="h-4 w-4" />
          <span>{t('common.filter')}</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">{t('common.filter')}</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </>
  )

  function FilterContent() {
    return (
      <div className="space-y-6">
        {/* Sort */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">{t('common.sort')}</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={currentFilters.sort === option.value || (!currentFilters.sort && option.value === 'newest')}
                  onChange={() => handleSortChange(option.value)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                />
                <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">{t('navigation.categories')}</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentFilters.category === category.slug}
                  onChange={() => handleCategoryChange(category.slug)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-gray-700">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">{t('shop.priceRange')}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('shop.minPrice')}</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('shop.maxPrice')}</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <button
              onClick={handlePriceFilter}
              className="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              {t('common.apply')}
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        <div>
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t('common.clear')} {t('common.filter')}
          </button>
        </div>
      </div>
    )
  }
}