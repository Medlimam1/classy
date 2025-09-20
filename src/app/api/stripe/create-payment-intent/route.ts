import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCart } from '@/lib/cart'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get cart summary
    const cartSummary = await getCart(session.user.id)
    
    if (cartSummary.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Create payment intent
    const defaultCurrency = (process.env.DEFAULT_CURRENCY || 'MRU').toLowerCase()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cartSummary.total * 100), // Convert to cents
      currency: defaultCurrency,
      metadata: {
        userId: session.user.id,
        itemCount: cartSummary.itemCount.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Create payment intent error:', error)
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}