import { z } from 'zod'

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Product validations
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().optional(),
  sku: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  inventory: z.number().min(0, 'Inventory must be positive').default(0),
  weight: z.number().min(0, 'Weight must be positive').optional(),
})

export const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  value: z.string().min(1, 'Variant value is required'),
  price: z.number().min(0, 'Price must be positive').optional(),
  inventory: z.number().min(0, 'Inventory must be positive').default(0),
  sku: z.string().optional(),
})

// Category validations
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().optional(),
  parentId: z.string().optional(),
})

// Order validations
export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
})

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsBilling: z.boolean().default(false),
  paymentMethod: z.enum(['STRIPE', 'BANKILY', 'MASRIFI', 'SADAD', 'COD']),
  couponCode: z.string().optional(),
})

// Cart validations
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().min(0, 'Quantity must be positive'),
})

// Coupon validations
export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().min(0, 'Value must be positive'),
  minOrderAmount: z.number().min(0, 'Minimum order amount must be positive').optional(),
  maxUses: z.number().min(1, 'Max uses must be at least 1').optional(),
  expiresAt: z.date().optional(),
  active: z.boolean().default(true),
})

// Review validations
export const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(1, 'Review title is required'),
  content: z.string().min(10, 'Review content must be at least 10 characters'),
})

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

// Search and filter validations
export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sort: z.enum(['newest', 'oldest', 'price-asc', 'price-desc', 'name-asc', 'name-desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type ProductVariantInput = z.infer<typeof productVariantSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type CouponInput = z.infer<typeof couponSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type SearchInput = z.infer<typeof searchSchema>