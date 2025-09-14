import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { useTranslations } from 'next-intl'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OrdersList from '@/components/orders/OrdersList'

interface OrdersPageProps {
  params: {
    locale: string
  }
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const session = await getServerSession(authOptions)
  const t = useTranslations()

  if (!session?.user?.id) {
    redirect(`/${params.locale}/auth/login?callbackUrl=/${params.locale}/orders`)
  }

  const orders = await prisma.order.findMany({
    where: {
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
          },
          variant: {
            select: {
              name: true,
              value: true,
            }
          }
        }
      },
      payments: {
        select: {
          provider: true,
          status: true,
        }
      },
      shipments: {
        select: {
          carrier: true,
          trackingNumber: true,
          status: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('orders.title')}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {t('orders.noOrders')}
          </div>
          <a
            href={`/${params.locale}/shop`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            {t('orders.startShopping')}
          </a>
        </div>
      ) : (
        <OrdersList orders={orders} locale={params.locale} />
      )}
    </div>
  )
}