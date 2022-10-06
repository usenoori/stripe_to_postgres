# stripe_to_postgres

## Usage

stripe_to_postgres is packaged as a Docker image you can run directly.

The image needs the following environment variables.

- `DATABASE_URL` is your Postgres instance's connection string.
- `STRIPE_SECRET_KEY` can be obtained from the Stripe dashboard https://dashboard.stripe.com/apikeys.

Example: 
`docker run --env-file=.env whollacsek/stripe_to_postgres`

## Development

- Start local Postgres instance: `docker compose up`
- `npm run dev`
