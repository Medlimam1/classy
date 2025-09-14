import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            الصفحة غير موجودة
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/ar">
              العودة للصفحة الرئيسية
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/ar/shop">
              تصفح المتجر
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          <div className="text-gray-400">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2.306" />
            </svg>
            <p className="text-sm">
              إذا كنت تعتقد أن هذا خطأ، يرجى التواصل معنا
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}