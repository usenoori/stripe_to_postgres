import dotenv from 'dotenv'

type configType = {
  DATABASE_URL: string
  NODE_ENV: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
}

function getConfigFromEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`${key} is undefined`)
  }
  return value
}

export function getConfig(): configType {
  dotenv.config()
  return {
    NODE_ENV: getConfigFromEnv('NODE_ENV'),
    DATABASE_URL: getConfigFromEnv('DATABASE_URL'),
    STRIPE_SECRET_KEY: getConfigFromEnv('STRIPE_SECRET_KEY'),
    STRIPE_WEBHOOK_SECRET: getConfigFromEnv('STRIPE_WEBHOOK_SECRET'),
  }
}
