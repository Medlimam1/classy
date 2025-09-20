import { notFound } from 'next/navigation';
import type { GetRequestConfigParams, RequestConfig } from 'next-intl/server';

export const locales = ['ar', 'en'] as const;
export type AppLocale = (typeof locales)[number];

export default async function getRequestConfig(
  params: GetRequestConfigParams & { requestLocale?: string | Promise<string> }
): Promise<RequestConfig> {
  // Support callers that pass either { locale } or { requestLocale } (some pages pass a Promise)
  let localeVal: string | undefined = (params as any).locale

  if (!localeVal && (params as any).requestLocale) {
    const maybe = (params as any).requestLocale
    // requestLocale might be a Promise<string>
    if (typeof maybe === 'string') {
      localeVal = maybe
    } else if (maybe && typeof maybe.then === 'function') {
      try {
        localeVal = await maybe
      } catch (e) {
        console.error('[i18n] failed to resolve requestLocale promise', e)
      }
    }
  }

  let base = (localeVal?.split('-')[0] ?? '').toLowerCase()
  console.log('[i18n] requested locale:', localeVal, '-> base:', base)

  // Default/fallback behavior: if locale is missing or unsupported, fall back to English
  if (!locales.includes(base as AppLocale)) {
    console.log('[i18n] locale not supported or undefined, falling back to en')
    base = 'en'
  }

  // Try to load messages for the resolved base. If that fails, try English as a final fallback.
  try {
    const messages = (await import(`../messages/${base}.json`)).default
    console.log('[i18n] messages loaded for', base)
    return { locale: base as AppLocale, messages }
  } catch (e) {
    console.error('[i18n] failed to load messages for', base, e)
    if (base !== 'en') {
      try {
        const messages = (await import(`../messages/en.json`)).default
        console.log('[i18n] fallback messages loaded for en')
        return { locale: 'en', messages }
      } catch (err) {
        console.error('[i18n] failed to load fallback en messages', err)
      }
    }
    // As a last resort, signal notFound so Next shows 404
    notFound()
  }
}
