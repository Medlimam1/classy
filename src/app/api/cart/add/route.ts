import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addToCart } from '@/lib/cart'
import { z } from 'zod'

const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().min(1).max(100),
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
    const validatedData = addToCartSchema.parse(body)

    const cartItem = await addToCart(
      session.user.id,
      validatedData.productId,
      validatedData.quantity,
      validatedData.variantId
    )

    return NextResponse.json({
      message: 'Item added to cart',
      cartItem,
    })
  } catch (error: any) {
    console.error('Add to cart error:', error)
    
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