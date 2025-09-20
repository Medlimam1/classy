import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/admin`)
  }

  if (session.user.role !== 'ADMIN') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <nav className="space-x-4">
            <Link href={`/${locale}/admin/products`} className="text-amber-600">Products</Link>
            <Link href={`/${locale}/admin/orders`} className="ml-4">Orders</Link>
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
