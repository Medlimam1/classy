'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface PaymentFormProps {
  clientSecret: string
  onSuccess: () => void
}

export default function PaymentForm({ clientSecret, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const t = useTranslations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message || t('checkout.paymentFailed'))
      } else {
        toast.success(t('checkout.paymentSuccess'))
        onSuccess()
      }
    } catch (error: any) {
      toast.error(error.message || t('checkout.paymentFailed'))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('checkout.paymentDetails')}
        </h3>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          t('checkout.completePayment')
        )}
      </button>
    </form>
  )
}