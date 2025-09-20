import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard } from 'lucide-react'

interface OrderDetailsProps {
  order: {
    id: string
    status: string
    total: number
    subtotal: number
    tax: number
    shipping: number
    discount: number
    createdAt: Date
    shippingAddress: any
    billingAddress: any
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
      id: string
      provider: string
      status: string
      amount: number
      createdAt: Date
      transactionId?: string
    }>
    shipments: Array<{
      id: string
      carrier: string
      trackingNumber: string
      status: string
      createdAt: Date
    }>
  }
  locale: string
}

export default function OrderDetails({ order, locale }: OrderDetailsProps) {
  const t = useTranslations()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'PENDING':
        return <Clock className="h-6 w-6 text-yellow-500" />
      case 'PAID':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'FULFILLED':
        return <Package className="h-6 w-6 text-blue-500" />
      case 'CANCELLED':
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-500" />
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

  return (
    <div className="space-y-8">
      {/* Order Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('orders.orderNumber')}: #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('orders.placedOn')} {formatDate(order.createdAt, locale)}
            </p>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {getStatusIcon(order.status)}
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {getStatusText(order.status)}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(order.total, undefined, locale)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Progress */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className={`flex items-center ${['NEW', 'PENDING', 'PAID', 'FULFILLED'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['NEW', 'PENDING', 'PAID', 'FULFILLED'].includes(order.status) ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm font-medium">{t('orders.orderPlaced')}</span>
              </div>
              <div className={`w-16 h-0.5 ${['PAID', 'FULFILLED'].includes(order.status) ? 'bg-green-600' : 'bg-gray-300'}`} />
              <div className={`flex items-center ${['PAID', 'FULFILLED'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['PAID', 'FULFILLED'].includes(order.status) ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm font-medium">{t('orders.paymentConfirmed')}</span>
              </div>
              <div className={`w-16 h-0.5 ${order.status === 'FULFILLED' ? 'bg-green-600' : 'bg-gray-300'}`} />
              <div className={`flex items-center ${order.status === 'FULFILLED' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'FULFILLED' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Package className="h-5 w-5" />
                </div>
                <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm font-medium">{t('orders.orderDelivered')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {t('orders.orderItems')}
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse py-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.images[0] || '/img/products/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${locale}/product/${item.product.slug}`}
                      className="text-lg font-medium text-gray-900 hover:text-amber-600"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-gray-500">
                        {item.variant.name}: {item.variant.value}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {t('cart.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity, undefined, locale)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price, undefined, locale)} {t('orders.each')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {t('orders.orderSummary')}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="text-gray-900">{formatPrice(order.subtotal, undefined, locale)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('cart.discount')}</span>
                  <span className="text-green-600">-{formatPrice(order.discount, undefined, locale)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span className="text-gray-900">
                  {order.shipping === 0 ? t('cart.freeShipping') : formatPrice(order.shipping, undefined, locale)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('cart.tax')}</span>
                <span className="text-gray-900">{formatPrice(order.tax, undefined, locale)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">{t('cart.total')}</span>
                  <span className="text-gray-900">{formatPrice(order.total, undefined, locale)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('orders.shippingAddress')}
              </h2>
              <div className="text-sm text-gray-600">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {order.payments.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('orders.paymentInformation')}
              </h2>
              {order.payments.map((payment) => (
                <div key={payment.id} className="text-sm text-gray-600">
                  <p><strong>{t('orders.method')}:</strong> {payment.provider}</p>
                  <p><strong>{t('orders.status')}:</strong> {payment.status}</p>
                  <p><strong>{t('orders.amount')}:</strong> {formatPrice(payment.amount, undefined, locale)}</p>
                  {payment.transactionId && (
                    <p><strong>{t('orders.transactionId')}:</strong> {payment.transactionId}</p>
                  )}
                  <p><strong>{t('orders.date')}:</strong> {formatDate(payment.createdAt, locale)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Shipping Information */}
          {order.shipments.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('orders.shippingInformation')}
              </h2>
              {order.shipments.map((shipment) => (
                <div key={shipment.id} className="text-sm text-gray-600">
                  <p><strong>{t('orders.carrier')}:</strong> {shipment.carrier}</p>
                  <p><strong>{t('orders.trackingNumber')}:</strong> {shipment.trackingNumber}</p>
                  <p><strong>{t('orders.status')}:</strong> {shipment.status}</p>
                  <p><strong>{t('orders.shippedOn')}:</strong> {formatDate(shipment.createdAt, locale)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}