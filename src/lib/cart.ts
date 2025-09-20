import { prisma } from './prisma'
import { calculateTax } from './utils'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
    slug: string
  }
  variant?: {
    id: string
    name: string
    value: string
    price?: number
  }
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  itemCount: number
}

export async function getCart(userId: string): Promise<CartSummary> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              slug: true,
            }
          },
          variant: {
            select: {
              id: true,
              name: true,
              value: true,
              price: true,
            }
          }
        }
      },
      coupon: true,
    }
  })

  if (!cart) {
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      itemCount: 0,
    }
  }
  // Convert Prisma Decimal values to plain numbers for the client
  const items: CartItem[] = cart.items.map((it: any) => ({
    id: it.id,
    productId: it.productId,
    variantId: it.variantId || undefined,
    quantity: it.quantity,
    product: {
      id: it.product.id,
      name: it.product.name,
      // price may be Decimal from Prisma
      price: typeof it.product.price === 'object' && it.product.price?.toNumber ? it.product.price.toNumber() : Number(it.product.price),
      images: it.product.images || [],
      slug: it.product.slug,
    },
    variant: it.variant ? {
      id: it.variant.id,
      name: it.variant.name,
      value: it.variant.value,
      price: typeof it.variant.price === 'object' && it.variant.price?.toNumber ? it.variant.price.toNumber() : (it.variant.price == null ? undefined : Number(it.variant.price)),
    } : undefined,
  }))

  const subtotal = calculateSubtotal(items)
  const discount = typeof cart.discount === 'object' && cart.discount?.toNumber ? cart.discount.toNumber() : Number(cart.discount || 0)
  const tax = calculateTax(subtotal - discount)
  const shipping = calculateShippingCost(subtotal)
  const total = subtotal + tax + shipping - discount
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    itemCount,
  }
}

// Helper: convert raw prisma cartItem include result into plain CartItem
function serializeCartItemRaw(it: any): CartItem {
  return {
    id: it.id,
    productId: it.productId,
    variantId: it.variantId || undefined,
    quantity: it.quantity,
    product: {
      id: it.product.id,
      name: it.product.name,
      price: typeof it.product.price === 'object' && it.product.price?.toNumber ? it.product.price.toNumber() : Number(it.product.price),
      images: it.product.images || [],
      slug: it.product.slug,
    },
    variant: it.variant ? {
      id: it.variant.id,
      name: it.variant.name,
      value: it.variant.value,
      price: it.variant.price == null ? undefined : (typeof it.variant.price === 'object' && it.variant.price?.toNumber ? it.variant.price.toNumber() : Number(it.variant.price)),
    } : undefined,
  }
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  variantId?: string
): Promise<CartItem> {
  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    })
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variantId || null,
    }
  })

  if (existingItem) {
    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          }
        },
        variant: {
          select: {
            id: true,
            name: true,
            value: true,
            price: true,
          }
        }
      }
    })
    return serializeCartItemRaw(updatedItem)
  } else {
    // Create new cart item
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          }
        },
        variant: {
          select: {
            id: true,
            name: true,
            value: true,
            price: true,
          }
        }
      }
    })
    return serializeCartItemRaw(newItem)
  }
}

export async function updateCartItem(
  userId: string,
  itemId: string,
  quantity: number
): Promise<CartItem | null> {
  if (quantity <= 0) {
    await removeFromCart(userId, itemId)
    return null
  }

  const updatedItem = await prisma.cartItem.update({
    where: {
      id: itemId,
      cart: { userId }
    },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          slug: true,
        }
      },
      variant: {
        select: {
          id: true,
          name: true,
          value: true,
          price: true,
        }
      }
    }
  })

  return serializeCartItemRaw(updatedItem)
}

export async function removeFromCart(
  userId: string,
  itemId: string
): Promise<void> {
  await prisma.cartItem.delete({
    where: {
      id: itemId,
      cart: { userId }
    }
  })
}

export async function clearCart(userId: string): Promise<void> {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })
  }
}

export async function applyCoupon(
  userId: string,
  couponCode: string
): Promise<{ success: boolean; discount: number; error?: string }> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: couponCode }
  })

  if (!coupon) {
    return { success: false, discount: 0, error: 'Invalid coupon code' }
  }

  if (!coupon.isActive) {
    return { success: false, discount: 0, error: 'Coupon is not active' }
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { success: false, discount: 0, error: 'Coupon has expired' }
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { success: false, discount: 0, error: 'Coupon usage limit reached' }
  }

  const cartSummary = await getCart(userId)

  if (coupon.minimumAmount && cartSummary.subtotal < Number(coupon.minimumAmount)) {
    return {
      success: false,
      discount: 0,
      error: `Minimum order amount is ${Number(coupon.minimumAmount)}`
    }
  }

  let discount = 0
  if (coupon.type === 'PERCENTAGE') {
    discount = (cartSummary.subtotal * Number(coupon.value)) / 100
  } else {
    discount = Number(coupon.value)
  }

  // Don't let discount exceed subtotal
  discount = Math.min(discount, cartSummary.subtotal)

  return { success: true, discount }
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.variant?.price || item.product.price
    return sum + (price * item.quantity)
  }, 0)
}

function calculateShippingCost(subtotal: number): number {
  // Free shipping over $100
  if (subtotal >= 100) return 0
  
  // Standard shipping rate
  return 10
}