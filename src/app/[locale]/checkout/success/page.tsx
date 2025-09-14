import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle, Package, Truck, Mail } from 'lucide-react'
import Link from 'next/link'

interface CheckoutSuccessPageProps {
  params: {
    locale: string
  }
  searchParams: {
    order_id?: string
    payment_intent?: string
  }
}

export default function CheckoutSuccessPage({ params, searchParams }: CheckoutSuccessPageProps) {
  const t = useTranslations()

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('checkout.success.title')}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {t('checkout.success.subtitle')}
          </p>
          
          {searchParams.order_id && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                {t('checkout.success.orderNumber')}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                #{searchParams.order_id.slice(-8).toUpperCase()}
              </p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {t('checkout.success.whatNext')}
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-3 rtl:ml-0 rtl:mr-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {t('checkout.success.steps.email.title')}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {t('checkout.success.steps.email.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-3 rtl:ml-0 rtl:mr-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {t('checkout.success.steps.processing.title')}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {t('checkout.success.steps.processing.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Truck className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-3 rtl:ml-0 rtl:mr-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {t('checkout.success.steps.shipping.title')}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {t('checkout.success.steps.shipping.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {searchParams.order_id && (
              <Link
                href={`/${params.locale}/orders/${searchParams.order_id}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
              >
                {t('checkout.success.viewOrder')}
              </Link>
            )}
            
            <Link
              href={`/${params.locale}/shop`}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {t('checkout.success.continueShopping')}
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-amber-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-amber-800 mb-2">
            {t('checkout.success.needHelp.title')}
          </h3>
          <p className="text-amber-700 mb-4">
            {t('checkout.success.needHelp.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${params.locale}/contact`}
              className="inline-flex items-center justify-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 transition-colors"
            >
              {t('checkout.success.needHelp.contact')}
            </Link>
            <Link
              href={`/${params.locale}/help`}
              className="inline-flex items-center justify-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 transition-colors"
            >
              {t('checkout.success.needHelp.help')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}