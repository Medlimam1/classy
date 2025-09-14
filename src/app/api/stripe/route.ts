import { NextRequest, NextResponse } from 'next/server'
import { getPaymentAdapter, PaymentProvider } from '@/lib/payments'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', orderId, metadata } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const stripeAdapter = getPaymentAdapter(PaymentProvider.STRIPE)
    const paymentIntent = await stripeAdapter.createPayment(
      amount,
      currency,
      { orderId, ...metadata }
    )

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Stripe payment creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}