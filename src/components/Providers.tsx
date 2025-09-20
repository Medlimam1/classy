"use client"
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { Toaster } from 'sonner'

export default function Providers({
  children,
  session,
  messages,
  locale,
}: {
  children: React.ReactNode
  session?: any
  messages: Record<string, any>
  locale?: string
}) {
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone="Africa/Cairo">
        {children}
        <Toaster position={locale === 'ar' ? 'bottom-left' : 'bottom-right'} richColors />
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
