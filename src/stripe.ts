import Stripe from 'stripe'
import { getConfig } from './config'

const config = getConfig()

export const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
})
