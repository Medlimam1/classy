import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price)
}

export function formatDate(
  date: Date | string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export function generateSKU(productName: string, variantName?: string): string {
  const base = productName
    .toUpperCase()
    .replace(/[^\w]/g, '')
    .slice(0, 6)
  
  const variant = variantName
    ? variantName.toUpperCase().replace(/[^\w]/g, '').slice(0, 3)
    : ''
  
  const random = Math.random().toString(36).substr(2, 3).toUpperCase()
  
  return `${base}${variant}${random}`
}

export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= discountedPrice) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{8,}$/
  return phoneRegex.test(phone)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculateTax(subtotal: number, taxRate: number = 0.1): number {
  return Math.round(subtotal * taxRate * 100) / 100
}

export function calculateShipping(
  weight: number,
  distance: number = 1,
  baseRate: number = 5
): number {
  const weightCost = weight * 2 // $2 per kg
  const distanceCost = distance * 1 // $1 per km
  return Math.max(baseRate, weightCost + distanceCost)
}

export function getImageUrl(
  publicId: string,
  transformations?: string
): string {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`
  }
  
  return `${baseUrl}/${publicId}`
}

export function getPlaceholderImage(
  width: number = 400,
  height: number = 400,
  text?: string
): string {
  const displayText = text ? encodeURIComponent(text) : 'No Image'
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${displayText}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}