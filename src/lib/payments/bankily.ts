import { PaymentAdapter, PaymentIntent, PaymentStatus } from './types'

export class BankilyAdapter implements PaymentAdapter {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.BANKILY_API_URL || 'https://mock.bankily.mr'
    this.apiKey = process.env.BANKILY_API_KEY || 'mock-bankily-key'
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
      const response = await fetch(`${this.apiUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      })

      if (!response.ok) {
        throw new Error(`Bankily API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapBankilyResponse(data)
    } catch (error) {
      console.error('Bankily payment creation failed:', error)
      throw new Error('Failed to create Bankily payment')
    }
  }

  async confirmPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockConfirmPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Bankily API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapBankilyResponse(data)
    } catch (error) {
      console.error('Bankily payment confirmation failed:', error)
      throw new Error('Failed to confirm Bankily payment')
    }
  }

  async cancelPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockCancelPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/payments/${paymentId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Bankily API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapBankilyResponse(data)
    } catch (error) {
      console.error('Bankily payment cancellation failed:', error)
      throw new Error('Failed to cancel Bankily payment')
    }
  }

  async getPayment(paymentId: string): Promise<PaymentIntent> {
    // Mock implementation
    if (this.apiUrl.includes('mock')) {
      return this.mockGetPayment(paymentId)
    }

    try {
      const response = await fetch(`${this.apiUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Bankily API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.mapBankilyResponse(data)
    } catch (error) {
      console.error('Bankily payment retrieval failed:', error)
      throw new Error('Failed to retrieve Bankily payment')
    }
  }

  private mockCreatePayment(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): PaymentIntent {
    return {
      id: `bankily_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  private mapBankilyResponse(data: any): PaymentIntent {
    return {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      status: this.mapBankilyStatus(data.status),
      metadata: data.metadata,
    }
  }

  private mapBankilyStatus(status: string): PaymentStatus {
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

export const bankilyAdapter = new BankilyAdapter()