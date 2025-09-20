import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProductsTableClient from '@/components/admin/ProductsTableClient'

interface ProductsPageProps {
  params: { locale: string }
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : undefined

  const products = await prisma.product.findMany({
    where: q ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] } : {},
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // Render server side and hand-off interactive table to client
  const serialized: Array<{id: string; name: string; slug: string; price: string; published: boolean}> = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: String(p.price ?? ''),
    published: Boolean(p.published),
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link href={`/${locale}/admin/products/new`} className="bg-amber-600 text-white px-4 py-2 rounded">New Product</Link>
      </div>

      <ProductsTableClient products={serialized} locale={locale} />
    </div>
  )
}
