import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function ensureAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureAdmin()
    const id = params.id
    const product = await prisma.product.findUnique({ where: { id } })
    return NextResponse.json(product)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureAdmin()
    const id = params.id
    const body = await req.json()

    const data: any = {
      name: body.name,
      nameAr: body.nameAr ?? body.name,
      slug: body.slug,
      description: body.description ?? undefined,
      descriptionAr: body.descriptionAr ?? undefined,
      price: body.price ?? undefined,
      comparePrice: body.comparePrice ?? undefined,
      sku: body.sku ?? undefined,
      featured: body.featured ?? undefined,
      published: body.published ?? undefined,
      status: body.status ?? undefined,
      images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : undefined),
      quantity: body.inventory ?? body.quantity ?? undefined,
    }

    // Remove undefined fields to avoid overwriting with undefined
    Object.keys(data).forEach(k => data[k] === undefined && delete data[k])

    const updated = await prisma.product.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureAdmin()
    const id = params.id
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 })
  }
}
