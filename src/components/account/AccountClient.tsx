"use client"

import React from 'react'
import { signOut } from 'next-auth/react'
import { useLocale } from 'next-intl'

export default function AccountClient() {
  const locale = useLocale()

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => signOut({ callbackUrl: `/${locale}` })}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Sign out
      </button>
    </div>
  )
}
