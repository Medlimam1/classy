import getRequestConfig from '@/app/i18n/request'

interface Props { params: any }

export default async function ChangePasswordPage({ params }: Props) {
  const { locale } = await params
  const cfg = await getRequestConfig({ requestLocale: Promise.resolve(locale) as any }).catch(() => null)
  const messages = cfg?.messages as Record<string,string> | null
  const t = (key: string) => messages?.[key] ?? key

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">{t('account.changePassword')}</h1>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <p className="text-gray-600">{t('account.changePasswordPlaceholder')}</p>
      </div>
    </div>
  )
}
