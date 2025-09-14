import { PaymentProvider, PaymentAdapter } from './types'
import { stripeAdapter } from './stripe'
import { bankilyAdapter } from './bankily'
import { masrifiAdapter } from './masrifi'
import { sadadAdapter } from './sadad'

export * from './types'

export function getPaymentAdapter(provider: PaymentProvider): PaymentAdapter {
  switch (provider) {
    case PaymentProvider.STRIPE:
      return stripeAdapter
    case PaymentProvider.BANKILY:
      return bankilyAdapter
    case PaymentProvider.MASRIFI:
      return masrifiAdapter
    case PaymentProvider.SADAD:
      return sadadAdapter
    case PaymentProvider.COD:
      throw new Error('COD does not require a payment adapter')
    default:
      throw new Error(`Unsupported payment provider: ${provider}`)
  }
}

export {
  stripeAdapter,
  bankilyAdapter,
  masrifiAdapter,
  sadadAdapter,
}