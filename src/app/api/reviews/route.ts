import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
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
    const { productId, rating, comment } = createReviewSchema.parse(body)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: session.user.id,
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Review created successfully',
      review,
    })
  } catch (error: any) {
    console.error('Create review error:', error)
    
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