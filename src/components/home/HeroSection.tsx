'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const locale = useLocale()
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-6">
            مرحباً بك في متجر كلاسي
          </h1>
          <p className="text-xl mb-8">
            اكتشف مجموعة واسعة من المنتجات عالية الجودة بأفضل الأسعار
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href={`/${locale}/shop`}>
                تسوق الآن
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href={`/${locale}/about`}>
                اعرف المزيد
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}