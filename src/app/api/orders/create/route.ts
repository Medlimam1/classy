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
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: validatedData.paymentMethod === 'COD' ? 'NEW' : 'PENDING',
        subtotal: cartSummary.subtotal,
        tax: cartSummary.tax,
        shipping: cartSummary.shipping,
        discount: cartSummary.discount,
        total: cartSummary.total,
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress,
        items: {
          create: cartSummary.items.map(item => ({
            productId: item.product.id,
            variantId: item.variant?.id,
            quantity: item.quantity,
            price: item.variant?.price || item.product.price,
            name: item.product.name,
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
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
        currency: 'USD',
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
            inventory: {
              decrement: item.quantity
            }
          }
        })
      }
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmation(session.user.email!, order)
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
  } catch (error: any) {
    console.error('Create order error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}