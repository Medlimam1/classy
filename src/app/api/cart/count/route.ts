import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCart } from '@/lib/cart'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const cartSummary = await getCart(session.user.id)

    return NextResponse.json({ itemCount: cartSummary.itemCount, subtotal: cartSummary.subtotal })
  } catch (error) {
    console.error('Cart count error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
