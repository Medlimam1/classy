import { prisma } from '@/lib/prisma'
import getRequestConfig from '../../../i18n/request'

interface AdminOrdersPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function AdminOrdersPage({ params }: AdminOrdersPageProps) {
  const { locale } = await params

  // Load translations
  const cfg = await getRequestConfig({ requestLocale: Promise.resolve(locale) as any }).catch(() => null)
  const messages = cfg?.messages as Record<string, string> | null
  const t = (key: string) => messages?.[key] ?? key

  // Fetch all orders with related data
  let orders = [] as any[]
  try {
    orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameAr: true,
                images: true,
              }
            }
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            provider: true,
            createdAt: true,
          }
        },
        shipments: true,
        coupon: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (e: unknown) {
    // Log server-side and render an empty list with a console error
    console.error('[admin/orders] prisma error:', e)
    orders = []
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">
              {t('admin.orders.id')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">
              {t('admin.orders.customer')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">
              {t('admin.orders.amount')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">
              {t('admin.orders.status')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">
              {t('admin.orders.date')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => {
            const totalAmount = order.payments.reduce((sum, payment) => sum + payment.amount, 0)
            const status = order.payments[0]?.status ?? 'PENDING'

            return (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                  <div className="text-sm text-gray-500">{order.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: 'MRU'
                  }).format(totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                    status === 'COMPLETED' 
                      ? 'bg-green-100 text-green-800'
                      : status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {t(`admin.orders.statuses.${status.toLowerCase()}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }).format(new Date(order.createdAt))}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">
            {t('admin.orders.empty')}
          </p>
        </div>
      )}
    </div>
  )
}