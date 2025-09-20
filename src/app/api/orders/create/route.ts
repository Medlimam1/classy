import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCart } from '@/lib/cart'
import { prisma } from '@/lib/prisma'
import { checkoutSchema } from '@/lib/validations'
import { sendOrderConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    // Get cart summary
    const cartSummary = await getCart(session.user.id)
    
    if (cartSummary.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Create order
    // Generate a simple orderNumber (can be replaced with a more robust generator)
    const orderNumber = `ORD-${Date.now()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: validatedData.paymentMethod === 'COD' ? 'NEW' : 'PENDING',
        subtotal: cartSummary.subtotal,
        tax: cartSummary.tax,
        shipping: cartSummary.shipping,
        discount: cartSummary.discount,
        total: cartSummary.total,
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress ?? validatedData.shippingAddress,
        items: {
          create: cartSummary.items.map(item => ({
            productId: item.product.id,
            variantId: item.variant?.id,
            quantity: item.quantity,
            price: item.variant?.price || item.product.price,
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true,
          }
        }
      }
    })

    // Create payment record
    let paymentStatus = 'PENDING'
    if (validatedData.paymentMethod === 'COD') {
      paymentStatus = 'PENDING'
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: validatedData.paymentMethod,
        status: paymentStatus,
        amount: cartSummary.total,
        currency: process.env.DEFAULT_CURRENCY || 'MRU',
        metadata: {},
      }
    })

    // For non-Stripe payments, mark as completed immediately (mock)
    if (['BANKILY', 'MASRIFI', 'SADAD', 'COD'].includes(validatedData.paymentMethod)) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' }
      })

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' }
      })

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: session.user.id
          }
        }
      })

      // Update product inventory
      for (const item of cartSummary.items) {
        await prisma.product.update({
          where: { id: item.product.id },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        })
      }
    }

    // Send order confirmation email (re-fetch order with items to ensure shape)
    try {
      const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { items: { include: { product: true } } }
      })

      type OrderWithItems = typeof fullOrder

      if (fullOrder) {
        await sendOrderConfirmation(session.user.email!, fullOrder as OrderWithItems)
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
      },
    })
    } catch (unknownError) {
      const error = unknownError as Error
      console.error('Create order error:', error)

      // Zod errors
      if ((error as any)?.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid input data', details: (error as any).errors },
          { status: 400 }
        )
      }

      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json(
          { error: 'Internal server error', details: String(error?.message ?? ''), stack: (error as unknown && (error as Error).stack) ?? null },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
}