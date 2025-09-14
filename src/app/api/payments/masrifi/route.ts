import { NextRequest, NextResponse } from 'next/server'
import { getPaymentAdapter, PaymentProvider } from '@/lib/payments'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'MRU', orderId, metadata } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const masrifiAdapter = getPaymentAdapter(PaymentProvider.MASRIFI)
    const paymentIntent = await masrifiAdapter.createPayment(
      amount,
      currency,
      { orderId, ...metadata }
    )

    return NextResponse.json({
      success: true,
      paymentIntent,
    })
  } catch (error) {
    console.error('Masrifi payment creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    const masrifiAdapter = getPaymentAdapter(PaymentProvider.MASRIFI)
    const paymentIntent = await masrifiAdapter.getPayment(paymentId)

    return NextResponse.json({
      success: true,
      paymentIntent,
    })
  } catch (error) {
    console.error('Masrifi payment retrieval failed:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve payment' },
      { status: 500 }
    )
  }
}