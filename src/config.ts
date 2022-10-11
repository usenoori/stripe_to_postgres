import dotenv from 'dotenv'

type configType = {
  PORT: string
  SKIP_SYNC: string | 'true'
  SKIP_MIGRATIONS: string | 'true'
  DATABASE_URL: string
  NODE_ENV: string
  STRIPE_SECRET_KEY: string
  WEBHOOK_URL: string
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
    PORT: getConfigFromEnv('PORT'),
    SKIP_SYNC: getConfigFromEnv('SKIP_SYNC'),
    SKIP_MIGRATIONS: getConfigFromEnv('SKIP_MIGRATIONS'),
    NODE_ENV: getConfigFromEnv('NODE_ENV'),
    DATABASE_URL: getConfigFromEnv('DATABASE_URL'),
    STRIPE_SECRET_KEY: getConfigFromEnv('STRIPE_SECRET_KEY'),
    WEBHOOK_URL: getConfigFromEnv('WEBHOOK_URL'),
  }
}
