import { PaymentAdapter, PaymentIntent, PaymentStatus } from './types'

export class MasrifiAdapter implements PaymentAdapter {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.MASRIFI_API_URL || 'https://mock.masrifi.mr'
    this.apiKey = process.env.MASRIFI_API_KEY || 'mock-masrifi-key'
  }

  async createPayment(
    amount: number,
    currency: string = 'MRU',
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    // Mock implementation for development
    if (this.apiUrl.includes('mock')) {
      return this.mockCreatePayment(amount, currency, metadata)
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      })

      if (!response.ok) {
        throw new Error(`Masrifi API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapMasrifiResponse(data)
    } catch (error) {
      console.error('Masrifi payment creation failed:', error)
      throw new Error('Failed to create Masrifi payment')
    }
  }

  async confirmPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockConfirmPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Masrifi API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapMasrifiResponse(data)
    } catch (error) {
      console.error('Masrifi payment confirmation failed:', error)
      throw new Error('Failed to confirm Masrifi payment')
    }
  }

  async cancelPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockCancelPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/payments/${paymentId}/cancel`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Masrifi API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapMasrifiResponse(data)
    } catch (error) {
      console.error('Masrifi payment cancellation failed:', error)
      throw new Error('Failed to cancel Masrifi payment')
    }
  }

  async getPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockGetPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/payments/${paymentId}`, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Masrifi API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapMasrifiResponse(data)
    } catch (error) {
      console.error('Masrifi payment retrieval failed:', error)
      throw new Error('Failed to retrieve Masrifi payment')
    }
  }

  private mockCreatePayment(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): PaymentIntent {
    return {
      id: `masrifi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: PaymentStatus.PENDING,
      metadata,
    }
  }

  private mockConfirmPayment(paymentId: string): PaymentIntent {
    return {
      id: paymentId,
      amount: 100, // Mock amount
      currency: 'MRU',
      status: PaymentStatus.COMPLETED,
    }
  }

  private mockCancelPayment(paymentId: string): PaymentIntent {
    return {
      id: paymentId,
      amount: 100, // Mock amount
      currency: 'MRU',
      status: PaymentStatus.CANCELLED,
    }
  }

  private mockGetPayment(paymentId: string): PaymentIntent {
    return {
      id: paymentId,
      amount: 100, // Mock amount
      currency: 'MRU',
      status: PaymentStatus.PENDING,
    }
  }

  private mapMasrifiResponse(data: any): PaymentIntent {
    return {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      status: this.mapMasrifiStatus(data.status),
      metadata: data.metadata,
    }
  }

  private mapMasrifiStatus(status: string): PaymentStatus {
    switch (status) {
      case 'completed':
      case 'success':
        return PaymentStatus.COMPLETED
      case 'cancelled':
      case 'canceled':
        return PaymentStatus.CANCELLED
      case 'pending':
      case 'processing':
        return PaymentStatus.PENDING
      default:
        return PaymentStatus.FAILED
    }
  }
}

export const masrifiAdapter = new MasrifiAdapter()