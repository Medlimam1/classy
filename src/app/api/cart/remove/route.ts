import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const removeCartItemSchema = z.object({
  itemId: z.string(),
})

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { itemId } = removeCartItemSchema.parse(body)

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: session.user.id,
        }
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Remove the cart item
    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json({
      message: 'Item removed from cart successfully',
    })
  } catch (error: any) {
    console.error('Remove cart item error:', error)
    
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