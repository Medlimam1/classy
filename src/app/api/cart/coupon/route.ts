import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const applyCouponSchema = z.object({
  code: z.string().min(1),
})

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
    const { code } = applyCouponSchema.parse(body)

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 400 }
      )
    }

    // Check if coupon is active
    if (!coupon.active) {
      return NextResponse.json(
        { error: 'Coupon is not active' },
        { status: 400 }
      )
    }

    // Check if coupon is expired
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      )
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'Coupon usage limit reached' },
        { status: 400 }
      )
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
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
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price
      return sum + (price * item.quantity)
    }, 0)

    // Check minimum order amount
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ${coupon.minOrderAmount} required` },
        { status: 400 }
      )
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.value) / 100
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount)
      }
    } else {
      discountAmount = coupon.value
    }

    // Update cart with coupon
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        couponId: coupon.id,
        discount: discountAmount,
      }
    })

    return NextResponse.json({
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      },
    })
  } catch (error: any) {
    console.error('Apply coupon error:', error)
    
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