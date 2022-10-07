# stripe_to_postgres

## Why we exist

We built Noori after working on multiple startups, where we had to rewrite the same code each time. We thought there should be an easier solution. After looking around we realized no one was building it..so we build it! 

## Usage

`stripe_to_postgres` is packaged as a Docker image you can run directly.

The image needs the following environment variables.

- `DATABASE_URL` is your Postgres instance's connection string.
- `STRIPE_SECRET_KEY` can be obtained from the Stripe dashboard https://dashboard.stripe.com/apikeys.

Example:

- Put the env vars in a .env file then run `docker run --env-file=.env usenoori/stripe_to_postgres`

## How does it work?

`stripe_to_postgres` calls Stripe and page through your Stripe data and
stores them in your Postgres database. It will first create a `stripe` schema then create all the necessary table
structures. These are the Stripe resources that are currently handled by us.

- events
- products
- prices
- customers
- subscriptions
- invoices
- charges
- coupons
- disputes
- plans

## Development

- Start local Postgres instance: `docker compose up`
- `npm run dev`

## Contact
Questions? Comments? Email us at hello@usenoori.com


