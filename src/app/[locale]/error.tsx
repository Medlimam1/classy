'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            حدث خطأ ما!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg">
            المحاولة مرة أخرى
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <a href="/ar">
              العودة للصفحة الرئيسية
            </a>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="text-sm font-medium text-red-800 mb-2">تفاصيل الخطأ (وضع التطوير):</h3>
            <pre className="text-xs text-red-700 overflow-auto">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}