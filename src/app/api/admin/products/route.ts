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

export async function GET(req: NextRequest) {
  try {
    await ensureAdmin()
    const url = new URL(req.url)
    const q = url.searchParams.get('q')

    const products = await prisma.product.findMany({
      where: q ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(products)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureAdmin()
    const body = await req.json()

    // Prepare data with sensible defaults / mapping
    const firstCategory = await prisma.category.findFirst({ select: { id: true } })
    if (!firstCategory) throw new Error('No category found. Create a category first.')

    const data = {
      name: body.name,
      nameAr: body.nameAr ?? body.name,
      slug: body.slug,
      description: body.description ?? null,
      descriptionAr: body.descriptionAr ?? null,
      price: body.price ?? 0,
      comparePrice: body.comparePrice ?? undefined,
      sku: body.sku ?? undefined,
      categoryId: body.categoryId ?? firstCategory.id,
      featured: body.featured ?? false,
      published: body.published ?? true,
      status: body.status ?? 'ACTIVE',
      images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : []),
      quantity: body.inventory ?? body.quantity ?? 0,
    }

    const product = await prisma.product.create({ data })
    return NextResponse.json(product)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
