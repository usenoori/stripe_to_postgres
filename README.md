# stripe_to_postgres

## Why we exist

We built Noori after working on multiple startups, where we had to rewrite the same code each time. We thought there should be an easier solution. After looking around we realized no one was building it..so we build it! 

## Usage

`stripe_to_postgres` is packaged as a Docker image you can run directly.

The image needs the following environment variables.

- `DATABASE_URL` is your Postgres instance's connection string.
- `STRIPE_SECRET_KEY` can be obtained from the Stripe dashboard https://dashboard.stripe.com/apikeys.
- `WEBHOOK_URL` is your https enabled endpoint where this image is deployed.

Example:

- Put the env vars in a .env file then run `docker run --env-file=.env usenoori/stripe_to_postgres`

### Update your Postgres search_path

By default, most database tools only look up database objects in the `public` schema, you might need to update
the `search_path` in your existing tooling to include the `stripe` schema we created for you.

## How does it work?

1. `stripe_to_postgres` will first create a `stripe` schema then create all the necessary table structures in your database.
2. Then it will call Stripe and page through your Stripe data to stores them in your database.
3. After the data sync is done a Stripe webhook will be created that keep your database up to date.

These are the Stripe resources that are currently handled by us.

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

## Requirements

At the moment we support Postgres from version 10, as the features evolve this support target could move towards
Postgres 12.

## Development

1. Start local Postgres instance: `docker compose up`
2. Run `stripe listen --forward-to localhost:3000` and add the output secret as `STRIPE_WEBHOOK_SECRET` env var
3. Start development server `npm run dev`

## Contact
Questions? Comments? Email us at hello@usenoori.com


