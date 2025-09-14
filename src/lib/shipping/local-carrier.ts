import { Carrier, ShippingQuote, ShipmentInfo, OrderForShipping, ShipmentStatus } from './types'

// Mock local storage for tracking (in production, use a database)
const shipments = new Map<string, ShipmentInfo>()

export class LocalCarrier implements Carrier {
  name = 'Local Carrier'

  async quote(order: OrderForShipping): Promise<ShippingQuote[]> {
    // Mock shipping quotes based on weight and location
    const baseWeight = order.totalWeight || this.calculateTotalWeight(order)
    const city = order.shippingAddress.city.toLowerCase()
    
    const quotes: ShippingQuote[] = []

    // Standard delivery
    let standardCost = 50 // Base cost in MRU
    if (baseWeight > 2) {
      standardCost += (baseWeight - 2) * 10
    }
    
    // City-based pricing
    if (city.includes('nouakchott')) {
      standardCost *= 0.8 // 20% discount for capital
    } else if (city.includes('nouadhibou')) {
      standardCost *= 1.2 // 20% surcharge for distant city
    }

    quotes.push({
      carrier: this.name,
      service: 'Standard',
      cost: Math.round(standardCost),
      estimatedDays: city.includes('nouakchott') ? 1 : 3,
      currency: 'MRU'
    })

    // Express delivery (only for Nouakchott)
    if (city.includes('nouakchott')) {
      quotes.push({
        carrier: this.name,
        service: 'Express',
        cost: Math.round(standardCost * 1.5),
        estimatedDays: 1,
        currency: 'MRU'
      })
    }

    return quotes
  }

  async createShipment(order: OrderForShipping): Promise<ShipmentInfo> {
    const trackingId = this.generateTrackingId()
    const estimatedDelivery = new Date()
    
    // Add estimated delivery days
    const city = order.shippingAddress.city.toLowerCase()
    const estimatedDays = city.includes('nouakchott') ? 1 : 3
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays)

    const shipment: ShipmentInfo = {
      id: `shipment_${Date.now()}`,
      carrier: this.name,
      trackingId,
      status: ShipmentStatus.PREP,
      estimatedDelivery,
      metadata: {
        orderId: order.id,
        createdAt: new Date().toISOString(),
        destination: order.shippingAddress.city,
      }
    }

    // Store in mock storage
    shipments.set(trackingId, shipment)

    // Simulate status updates after creation
    this.simulateStatusUpdates(trackingId)

    return shipment
  }

  async track(trackingId: string): Promise<ShipmentInfo> {
    const shipment = shipments.get(trackingId)
    
    if (!shipment) {
      throw new Error(`Shipment not found for tracking ID: ${trackingId}`)
    }

    return shipment
  }

  private calculateTotalWeight(order: OrderForShipping): number {
    return order.items.reduce((total, item) => {
      const itemWeight = item.weight || 0.5 // Default 0.5kg per item
      return total + (itemWeight * item.quantity)
    }, 0)
  }

  private generateTrackingId(): string {
    const prefix = 'LC'
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  private simulateStatusUpdates(trackingId: string) {
    // Simulate shipment status updates
    setTimeout(() => {
      const shipment = shipments.get(trackingId)
      if (shipment && shipment.status === ShipmentStatus.PREP) {
        shipment.status = ShipmentStatus.IN_TRANSIT
        shipment.shippedAt = new Date()
        shipments.set(trackingId, shipment)
      }
    }, 2000) // 2 seconds after creation

    // Simulate delivery (for demo purposes, deliver quickly)
    setTimeout(() => {
      const shipment = shipments.get(trackingId)
      if (shipment && shipment.status === ShipmentStatus.IN_TRANSIT) {
        shipment.status = ShipmentStatus.DELIVERED
        shipment.deliveredAt = new Date()
        shipments.set(trackingId, shipment)
      }
    }, 10000) // 10 seconds after creation (for demo)
  }
}

export const localCarrier = new LocalCarrier()