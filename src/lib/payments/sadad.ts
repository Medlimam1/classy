import { PaymentAdapter, PaymentIntent, PaymentStatus } from './types'

export class SadadAdapter implements PaymentAdapter {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.SADAD_API_URL || 'https://mock.sadad.mr'
    this.apiKey = process.env.SADAD_API_KEY || 'mock-sadad-key'
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
      const response = await fetch(`${this.apiUrl}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      })

      if (!response.ok) {
        throw new Error(`Sadad API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapSadadResponse(data)
    } catch (error) {
      console.error('Sadad payment creation failed:', error)
      throw new Error('Failed to create Sadad payment')
    }
  }

  async confirmPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockConfirmPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/payment/${paymentId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Sadad API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapSadadResponse(data)
    } catch (error) {
      console.error('Sadad payment confirmation failed:', error)
      throw new Error('Failed to confirm Sadad payment')
    }
  }

  async cancelPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockCancelPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/payment/${paymentId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Sadad API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapSadadResponse(data)
    } catch (error) {
      console.error('Sadad payment cancellation failed:', error)
      throw new Error('Failed to cancel Sadad payment')
    }
  }

  async getPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockGetPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/payment/${paymentId}`, {
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Sadad API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapSadadResponse(data)
    } catch (error) {
      console.error('Sadad payment retrieval failed:', error)
      throw new Error('Failed to retrieve Sadad payment')
    }
  }

  private mockCreatePayment(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): PaymentIntent {
    return {
      id: `sadad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  private mapSadadResponse(data: any): PaymentIntent {
    return {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      status: this.mapSadadStatus(data.status),
      metadata: data.metadata,
    }
  }

  private mapSadadStatus(status: string): PaymentStatus {
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

export const sadadAdapter = new SadadAdapter()