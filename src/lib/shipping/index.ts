import { Carrier } from './types'
import { localCarrier } from './local-carrier'

export * from './types'
export { localCarrier }

// Carrier registry
const carriers = new Map<string, Carrier>()
carriers.set('local', localCarrier)

export function getCarrier(name: string): Carrier {
  const carrier = carriers.get(name)
  if (!carrier) {
    throw new Error(`Carrier not found: ${name}`)
  }
  return carrier
}

export function getAvailableCarriers(): string[] {
  return Array.from(carriers.keys())
}

export function registerCarrier(name: string, carrier: Carrier) {
  carriers.set(name, carrier)
}