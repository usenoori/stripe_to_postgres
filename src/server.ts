import { runMigrations } from './migrate'
import { runSync } from './sync'
import { getConfig } from './config'
import { startWebhook } from './webhook'

const config = getConfig()

const main = async () => {
  if (config.SKIP_MIGRATIONS === 'true') {
    console.log('Skipping migrations')
  } else {
    await runMigrations()
  }

  if (config.SKIP_SYNC === 'true') {
    console.log('Skipping sync')
  } else {
    await runSync()
  }

  startWebhook()
}

main()
