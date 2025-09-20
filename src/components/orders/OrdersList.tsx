import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  items: Array<{
    id: string
    quantity: number
    price: number
    name: string
    product: {
      name: string
      slug: string
      images: string[]
    }
    variant?: {
      name: string
      value: string
    }
  }>
  payments: Array<{
    provider: string
    status: string
  }>
  shipments: Array<{
    carrier: string
    trackingNumber: string
    status: string
  }>
}

interface OrdersListProps {
  orders: Order[]
  locale: string
}

export default function OrdersList({ orders, locale }: OrdersListProps) {
  const t = useTranslations()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'PAID':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'FULFILLED':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW':
        return t('orders.statusNew')
      case 'PENDING':
        return t('orders.statusPending')
      case 'PAID':
        return t('orders.statusPaid')
      case 'FULFILLED':
        return t('orders.statusFulfilled')
      case 'CANCELLED':
        return t('orders.statusCancelled')
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'FULFILLED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
          {/* Order Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('orders.orderNumber')}: #{order.id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt, locale)}
                  </p>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {getStatusIcon(order.status)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(order.total, undefined, locale)}
                </p>
                <p className="text-sm text-gray-500">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-6 py-4">
            <div className="space-y-4">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.images[0] || '/img/products/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${locale}/product/${item.product.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-amber-600"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-gray-500">
                        {item.variant.name}: {item.variant.value}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {t('cart.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity, undefined, locale)}
                  </div>
                </div>
              ))}
              
              {order.items.length > 3 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500">
                    +{order.items.length - 3} {t('orders.moreItems')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                {order.payments.length > 0 && (
                  <span>
                    {t('orders.payment')}: {order.payments[0].provider}
                  </span>
                )}
                {order.shipments.length > 0 && (
                  <span className="flex items-center">
                    <Truck className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    {t('orders.tracking')}: {order.shipments[0].trackingNumber}
                  </span>
                )}
              </div>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Link
                  href={`/${locale}/orders/${order.id}`}
                  className="text-sm font-medium text-amber-600 hover:text-amber-500"
                >
                  {t('orders.viewDetails')}
                </Link>
                {order.status === 'FULFILLED' && (
                  <button className="text-sm font-medium text-gray-600 hover:text-gray-500">
                    {t('orders.reorder')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}