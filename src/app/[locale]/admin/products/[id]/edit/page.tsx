import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

interface EditProductPageProps {
  params: { locale: string, id: string }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const locale = params?.locale ?? 'en'
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/admin/products/${params.id}/edit`)
  }

  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) notFound()

  // serialize fields for client
  const initial = {
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    price: Number((product.price as any) ?? 0),
    inventory: product.quantity ?? 0,
    images: Array.isArray(product.images) ? product.images.join(', ') : '',
    published: Boolean(product.published),
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
  <ProductForm initial={initial} action="update" id={params.id} onSuccess={`/${locale}/admin/products`} />
    </div>
  )
}
