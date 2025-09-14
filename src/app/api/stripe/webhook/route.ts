import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailure(failedPayment)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata.userId

  if (!userId) {
    console.error('No userId in payment intent metadata')
    return
  }

  try {
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          }
        }
      }
    })

    if (!cart || cart.items.length === 0) {
      console.error('Cart not found or empty for user:', userId)
      return
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price
      return sum + (price * item.quantity)
    }, 0)

    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PAID',
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: {}, // Will be updated from checkout form
        billingAddress: {},
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant?.price || item.product.price,
            name: item.product.name,
          }))
        }
      }
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'STRIPE',
        status: 'COMPLETED',
        amount: total,
        currency: 'USD',
        transactionId: paymentIntent.id,
        metadata: paymentIntent as any,
      }
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    // Update product inventory
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          inventory: {
            decrement: item.quantity
          }
        }
      })
    }

    console.log('Order created successfully:', order.id)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata.userId

  if (!userId) {
    console.error('No userId in payment intent metadata')
    return
  }

  try {
    // Find existing order if any and update status
    const existingPayment = await prisma.payment.findFirst({
      where: {
        transactionId: paymentIntent.id,
        provider: 'STRIPE',
      },
      include: {
        order: true,
      }
    })

    if (existingPayment) {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: { status: 'FAILED' }
      })

      await prisma.order.update({
        where: { id: existingPayment.orderId },
        data: { status: 'CANCELLED' }
      })
    }

    console.log('Payment failure handled for:', paymentIntent.id)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}