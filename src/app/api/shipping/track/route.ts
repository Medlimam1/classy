import { NextRequest, NextResponse } from 'next/server'
import { getCarrier } from '@/lib/shipping'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackingId = searchParams.get('trackingId')
    const carrier = searchParams.get('carrier') || 'local'

    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      )
    }

    const carrierInstance = getCarrier(carrier)
    const shipmentInfo = await carrierInstance.track(trackingId)

    return NextResponse.json({
      success: true,
      shipment: shipmentInfo,
    })
  } catch (error) {
    console.error('Tracking failed:', error)
    return NextResponse.json(
      { error: 'Failed to track shipment' },
      { status: 500 }
    )
  }
}