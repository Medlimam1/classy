'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
}

export default function Pagination({ currentPage, totalPages, totalCount }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/${locale}/shop?${params.toString()}`)
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('common.previous')}
        </button>
        <button
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="relative ml-3 rtl:ml-0 rtl:mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('common.next')}
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {t('pagination.showing')} <span className="font-medium">{(currentPage - 1) * 12 + 1}</span> {t('pagination.to')}{' '}
            <span className="font-medium">{Math.min(currentPage * 12, totalCount)}</span> {t('pagination.of')}{' '}
            <span className="font-medium">{totalCount}</span> {t('pagination.results')}
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rtl:space-x-reverse rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center rounded-l-md rtl:rounded-l-none rtl:rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">{t('common.previous')}</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {visiblePages.map((page, index) => (
              <span key={index}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => navigateToPage(page as number)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === page
                        ? 'z-10 bg-amber-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </span>
            ))}
            
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="relative inline-flex items-center rounded-r-md rtl:rounded-r-none rtl:rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">{t('common.next')}</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}