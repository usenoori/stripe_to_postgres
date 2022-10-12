import { getConfig } from './config'
import http from 'http'
import serve, { buffer, send, sendError } from 'micro'
import Stripe from 'stripe'
import { stripe } from './stripe'

const config = getConfig()

function makeServer(webhookSecret: string) {
  return new http.Server(
    serve(async (req, res) => {
      const sig = req.headers['stripe-signature'] as string
      const body = await buffer(req)

      try {
        const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
        console.log(event.type)
        switch (event.type) {
          default:
            throw new Error('Unhandled webhook event')
        }

        await send(res, 200)
      } catch (err) {
        await sendError(req, res, err)
      }
    })
  )
}

const WEBHOOK_API_VERSION = '2022-08-01'

// https://stripe.com/docs/api/webhook_endpoints/create#create_webhook_endpoint-enabled_events
const enabled_events: Array<Stripe.WebhookEndpointCreateParams.EnabledEvent> = [
  'charge.failed',
  'charge.refunded',
  'charge.succeeded',
  'customer.created',
  'customer.updated',
  'customer.subscription.created',
  'customer.subscription.deleted',
  'customer.subscription.updated',
  'invoice.created',
  'invoice.finalized',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.payment_succeeded',
  'invoice.updated',
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
]

async function getOrCreateWebhook() {
  const webhookEndpoints = await stripe.webhookEndpoints
    .list()
    .autoPagingToArray({ limit: 100 })
  const webhookEndpoint = webhookEndpoints.find(
    (value) => value.metadata.creator === 'stripe_to_postgres'
  )

  // Create webhook if not exists
  if (webhookEndpoint == null) {
    console.log(`Creating webhook ${config.WEBHOOK_URL}`)
    const { id, secret } = await stripe.webhookEndpoints.create({
      api_version: WEBHOOK_API_VERSION,
      url: config.WEBHOOK_URL as string,
      metadata: { creator: 'stripe_to_postgres' },
      description: 'stripe_to_postgres webhook',
      enabled_events,
    })

    return stripe.webhookEndpoints.update(id, {
      metadata: { secret: secret as string },
    })
  }

  console.log(
    `Found existing webhook ${webhookEndpoint.api_version} ${webhookEndpoint.url}`
  )

  // Update url
  if (webhookEndpoint.url !== config.WEBHOOK_URL) {
    console.log('Updating webhook url')
    return stripe.webhookEndpoints.update(webhookEndpoint.id, {
      url: config.WEBHOOK_URL,
    })
  }

  // Update enabled_events
  if (
    webhookEndpoint.enabled_events.length !== enabled_events.length ||
    enabled_events.some(
      (value) => !webhookEndpoint.enabled_events.includes(value)
    )
  ) {
    console.log('Updating webhook enabled_events')
    return stripe.webhookEndpoints.update(webhookEndpoint.id, {
      enabled_events,
    })
  }

  return webhookEndpoint
}

export async function startWebhook() {
  let secret: string
  if (config.NODE_ENV === 'production') {
    const webhookEndpoint = await getOrCreateWebhook()
    const { secret: webhookSecret } = webhookEndpoint.metadata
    secret = webhookSecret
  } else {
    secret = config.STRIPE_WEBHOOK_SECRET as string
  }
  makeServer(secret).listen(config.PORT, () => {
    console.log(`Webhook listening on ${config.PORT}`)
  })
}
