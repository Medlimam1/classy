import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateCartSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1).max(100),
})

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { itemId, quantity } = updateCartSchema.parse(body)

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: session.user.id,
        }
      },
      include: {
        product: {
          select: {
            quantity: true,
          }
        }
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Check inventory
    if (quantity > cartItem.product.quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      )
    }

    // Update the cart item
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            name: true,
            price: true,
          }
        },
        variant: {
          select: {
            name: true,
            value: true,
            price: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Cart updated successfully',
      item: updatedItem,
    })
  } catch (error: any) {
    console.error('Update cart error:', error)
    
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