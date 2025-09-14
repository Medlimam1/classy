import { NextRequest, NextResponse } from 'next/server'
import { getCarrier } from '@/lib/shipping'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    if (!orderData.shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    // For now, we only support local carrier
    const carrier = getCarrier('local')
    const quotes = await carrier.quote(orderData)

    return NextResponse.json({
      success: true,
      quotes,
    })
  } catch (error) {
    console.error('Shipping quote failed:', error)
    return NextResponse.json(
      { error: 'Failed to get shipping quote' },
      { status: 500 }
    )
  }
}