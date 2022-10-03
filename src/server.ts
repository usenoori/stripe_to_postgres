import { runMigrations } from './migrate'

const main = async () => {
  // Run migrations
  await runMigrations()
}

main()
