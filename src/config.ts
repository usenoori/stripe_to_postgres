import dotenv from 'dotenv'

type configType = {
  PORT: string
  SKIP_SYNC: string
  SKIP_MIGRATIONS: string
  DATABASE_URL: string
  NODE_ENV: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string | undefined
  WEBHOOK_URL: string | undefined
}

export function getConfig(): configType {
  dotenv.config()
  return {
    PORT: process.env.PORT ?? '3000',
    SKIP_SYNC: process.env.SKIP_SYNC ?? 'false',
    SKIP_MIGRATIONS: process.env.SKIP_MIGRATIONS ?? 'false',
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    DATABASE_URL: process.env.DATABASE_URL as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
  }
}
