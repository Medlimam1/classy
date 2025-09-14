export enum ShipmentStatus {
  PREP = 'PREP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
  phone?: string
}

export interface ShippingQuote {
  carrier: string
  service: string
  cost: number
  estimatedDays: number
  currency: string
}

export interface ShipmentInfo {
  id: string
  carrier: string
  trackingId?: string
  status: ShipmentStatus
  shippedAt?: Date
  deliveredAt?: Date
  estimatedDelivery?: Date
  metadata?: Record<string, any>
}

export interface OrderForShipping {
  id: string
  items: Array<{
    id: string
    name: string
    quantity: number
    weight?: number
  }>
  shippingAddress: Address
  totalWeight?: number
}

export interface Carrier {
  name: string
  quote(order: OrderForShipping): Promise<ShippingQuote[]>
  createShipment(order: OrderForShipping): Promise<ShipmentInfo>
  track(trackingId: string): Promise<ShipmentInfo>
}