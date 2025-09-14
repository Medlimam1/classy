'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import AddressForm from './AddressForm'
import PaymentForm from './PaymentForm'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  locale: string
}

export default function CheckoutForm({ locale }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CheckoutInput>>({
    paymentMethod: 'STRIPE',
    sameAsBilling: true,
  })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const t = useTranslations()
  const router = useRouter()

  const steps = [
    { id: 1, name: t('checkout.shippingAddress') },
    { id: 2, name: t('checkout.paymentMethod') },
    { id: 3, name: t('checkout.review') },
  ]

  const handleAddressSubmit = (addressData: any) => {
    setFormData(prev => ({ ...prev, ...addressData }))
    setCurrentStep(2)
  }

  const handlePaymentMethodSelect = async (paymentMethod: string) => {
    setFormData(prev => ({ ...prev, paymentMethod }))
    
    if (paymentMethod === 'STRIPE') {
      // Create payment intent
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error)
        }

        setClientSecret(data.clientSecret)
      } catch (error: any) {
        toast.error(error.message || t('common.error'))
        return
      }
    }
    
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      // Validate form data
      const validatedData = checkoutSchema.parse(formData)

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(t('checkout.orderPlaced'))
      router.push(`/${locale}/orders/${data.order.id}`)
    } catch (error: any) {
      toast.error(error.message || t('checkout.paymentFailed'))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      {/* Progress Steps */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                {stepIdx !== steps.length - 1 && (
                  <div className={`h-0.5 w-full ${currentStep > step.id ? 'bg-amber-600' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                currentStep > step.id
                  ? 'bg-amber-600 text-white'
                  : currentStep === step.id
                  ? 'border-2 border-amber-600 bg-white text-amber-600'
                  : 'border-2 border-gray-300 bg-white text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500">
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {currentStep === 1 && (
          <AddressForm
            onSubmit={handleAddressSubmit}
            initialData={formData}
          />
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {t('checkout.paymentMethod')}
            </h2>
            <div className="space-y-4">
              {['STRIPE', 'BANKILY', 'MASRIFI', 'SADAD', 'COD'].map((method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={() => handlePaymentMethodSelect(method)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <span className="ml-3 rtl:ml-0 rtl:mr-3 text-sm font-medium text-gray-700">
                    {method === 'COD' ? t('checkout.cashOnDelivery') : method}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {t('checkout.review')}
            </h2>
            
            {formData.paymentMethod === 'STRIPE' && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  onSuccess={() => router.push(`/${locale}/orders`)}
                />
              </Elements>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  t('checkout.placeOrder')
                )}
              </button>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}