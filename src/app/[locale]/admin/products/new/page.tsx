import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

interface NewProductPageProps {
  params: { locale: string }
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const locale = params?.locale ?? 'en'
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/admin/products/new`)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">New Product</h2>
  <ProductForm onSuccess={`/${locale}/admin/products`} action="create" />
    </div>
  )
}
