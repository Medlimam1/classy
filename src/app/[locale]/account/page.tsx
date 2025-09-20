import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import getRequestConfig from '@/app/i18n/request'
import { redirect } from 'next/navigation'
import AccountClient from '@/components/account/AccountClient'

export default async function AccountPage({ params }: any) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/account`)
  }

  const cfg = await getRequestConfig({ requestLocale: Promise.resolve(locale) as any }).catch(() => null)
  const messages = cfg?.messages as Record<string, string> | null
  const t = (key: string) => messages?.[key] ?? key

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">{t('navigation.account')}</h1>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <p className="text-gray-700">{session?.user?.name ?? session?.user?.email}</p>
        <p className="text-sm text-gray-500 mt-2">{session?.user?.email}</p>

        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href={`/${locale}/account/edit`} className="block px-4 py-3 border rounded hover:bg-gray-50">{t('account.editProfile')}</a>
            <a href={`/${locale}/account/change-password`} className="block px-4 py-3 border rounded hover:bg-gray-50">{t('account.changePassword')}</a>
            <a href={`/${locale}/account/addresses`} className="block px-4 py-3 border rounded hover:bg-gray-50">{t('account.addresses')}</a>
            <a href={`/${locale}/orders`} className="block px-4 py-3 border rounded hover:bg-gray-50">{t('account.orders')}</a>
          </div>

          <div className="mt-6"><AccountClient /></div>
        </div>
      </div>
    </div>
  )
}
