export enum PaymentProvider {
  STRIPE = 'STRIPE',
  BANKILY = 'BANKILY',
  MASRIFI = 'MASRIFI',
  SADAD = 'SADAD',
  COD = 'COD'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  clientSecret?: string
  metadata?: Record<string, any>
}

export interface PaymentAdapter {
  createPayment(amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntent>
  confirmPayment(paymentId: string): Promise<PaymentIntent>
  cancelPayment(paymentId: string): Promise<PaymentIntent>
  getPayment(paymentId: string): Promise<PaymentIntent>
}

export interface CreatePaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerId?: string
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  success: boolean
  paymentIntent?: PaymentIntent
  error?: string
}