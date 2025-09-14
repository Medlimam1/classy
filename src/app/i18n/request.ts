import { notFound } from 'next/navigation';
import type { GetRequestConfigParams, RequestConfig } from 'next-intl/server';

export const locales = ['ar', 'en'] as const;
export type AppLocale = (typeof locales)[number];

export default async function getRequestConfig(
  { locale }: GetRequestConfigParams
): Promise<RequestConfig> {
  const base = (locale?.split('-')[0] ?? '').toLowerCase() as AppLocale;
  if (!locales.includes(base)) notFound();

  const messages = (await import(`../messages/${base}.json`)).default;
  return { locale: base, messages };
}
