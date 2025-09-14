import Stripe from 'stripe'
import { PaymentAdapter, PaymentIntent, PaymentStatus } from './types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export class StripeAdapter implements PaymentAdapter {
  async createPayment(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: this.mapStripeStatus(paymentIntent.status),
        clientSecret: paymentIntent.client_secret || undefined,
        metadata: paymentIntent.metadata,
      }
    } catch (error) {
      console.error('Stripe payment creation failed:', error)
      throw new Error('Failed to create payment')
    }
  }

  async confirmPayment(paymentId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentId)

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: this.mapStripeStatus(paymentIntent.status),
        clientSecret: paymentIntent.client_secret || undefined,
        metadata: paymentIntent.metadata,
      }
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error)
      throw new Error('Failed to confirm payment')
    }
  }

  async cancelPayment(paymentId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentId)

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: this.mapStripeStatus(paymentIntent.status),
        clientSecret: paymentIntent.client_secret || undefined,
        metadata: paymentIntent.metadata,
      }
    } catch (error) {
      console.error('Stripe payment cancellation failed:', error)
      throw new Error('Failed to cancel payment')
    }
  }

  async getPayment(paymentId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: this.mapStripeStatus(paymentIntent.status),
        clientSecret: paymentIntent.client_secret || undefined,
        metadata: paymentIntent.metadata,
      }
    } catch (error) {
      console.error('Stripe payment retrieval failed:', error)
      throw new Error('Failed to retrieve payment')
    }
  }

  private mapStripeStatus(status: string): PaymentStatus {
    switch (status) {
      case 'succeeded':
        return PaymentStatus.COMPLETED
      case 'canceled':
        return PaymentStatus.CANCELLED
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return PaymentStatus.PENDING
      default:
        return PaymentStatus.FAILED
    }
  }
}

export const stripeAdapter = new StripeAdapter()