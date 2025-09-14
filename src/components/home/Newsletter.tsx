'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error(t('newsletter.emailRequired'))
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(t('newsletter.subscribed'))
      setEmail('')
    } catch (error) {
      toast.error(t('newsletter.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-amber-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t('newsletter.title')}
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-6 text-amber-200">
            {t('newsletter.subtitle')}
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:ml-8 rtl:lg:ml-0 rtl:lg:mr-8">
          <form className="sm:flex" onSubmit={handleSubmit}>
            <label htmlFor="email-address" className="sr-only">
              {t('newsletter.emailAddress')}
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
              placeholder={t('newsletter.enterEmail')}
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 rtl:sm:ml-0 rtl:sm:mr-3 sm:flex-shrink-0">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-amber-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t('newsletter.subscribe')}
                  </>
                )}
              </button>
            </div>
          </form>
          <p className="mt-3 text-sm text-amber-200">
            {t('newsletter.privacy')}
            <a href="#" className="text-white font-medium underline">
              {t('newsletter.privacyPolicy')}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}