import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
// server-side pages load messages directly; do not use client hooks here
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OrderDetails from '@/components/orders/OrderDetails'

interface OrderPageProps {
  params: {
    locale: string
    id: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale, id } = await params
  const session = await getServerSession(authOptions)

  // Load messages server-side
  const base = locale.split('-')[0].toLowerCase()
  const messages = (await import(`../../../messages/${base}.json`)).default
  const t = (key: string) => messages?.[key] ?? key

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/orders/${params.id}`)
  }

  const order = await prisma.order.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              images: true,
            }
          }
        }
      },
      payments: {
        orderBy: {
          createdAt: 'desc',
        }
      },
      shipments: {
        orderBy: {
          createdAt: 'desc',
        }
      }
    }
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse md:space-x-3">
          <li className="inline-flex items-center">
            <a href={`/${locale}`} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-amber-600">
              {t('navigation.home')}
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <a href={`/${locale}/orders`} className="ml-1 rtl:ml-0 rtl:mr-1 text-sm font-medium text-gray-700 hover:text-amber-600 md:ml-2 rtl:md:ml-0 rtl:md:mr-2">
                {t('orders.title')}
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ml-1 rtl:ml-0 rtl:mr-1 text-sm font-medium text-gray-500 md:ml-2 rtl:md:ml-0 rtl:md:mr-2">
                #{order.id.slice(-8).toUpperCase()}
              </span>
            </div>
          </li>
        </ol>
      </nav>

  <OrderDetails order={order} locale={locale} />
    </div>
  )
}