import { runMigrations } from './migrate'
import { runSync } from './sync'

const main = async () => {
  await runMigrations()

  await runSync()
}

main()
