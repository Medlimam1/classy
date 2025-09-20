import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCart } from '@/lib/cart'
import CartItems from '@/components/cart/CartItems'
import CartSummary from '@/components/cart/CartSummary'
import Link from 'next/link'

interface CartPageProps {
  params: {
    locale: string
  }
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/cart`)
  }

  const cartSummary = await getCart(session.user.id)

  // Render a client component for hooks (useTranslations, useSession)
  const CartClient = (await import('@/components/cart/CartClient')).default

  return <CartClient cartSummary={cartSummary} locale={locale} />
}