import chunk from 'lodash.chunk'
import { stripe } from './stripe'
import { getColumns, upsert } from './connection'
import { filterRecord, Record } from './utils'

async function upsertRecords(
  table: string,
  resource: AsyncIterableIterator<Record>
) {
  const columns = await getColumns(table)

  console.log(`Upserting ${table}`)
  const rows = []
  for await (const record of resource) {
    const row = filterRecord(record, columns)
    rows.push(row)
  }

  // TODO: find optimal chunk size
  for (const chunkedRows of chunk(rows, 100)) {
    await upsert(table, columns, chunkedRows)
  }
  console.log(`Upserted ${rows.length} ${table}`)
}

export async function runSync() {
  await upsertRecords('products', stripe.products.list({ limit: 100 }))
  await upsertRecords('prices', stripe.prices.list({ limit: 100 }))
  await upsertRecords('customers', stripe.customers.list({ limit: 100 }))
  await upsertRecords(
    'subscriptions',
    stripe.subscriptions.list({ limit: 100, status: 'all' })
  )
  await upsertRecords('invoices', stripe.invoices.list({ limit: 100 }))
  await upsertRecords('charges', stripe.charges.list({ limit: 100 }))
  await upsertRecords('coupons', stripe.coupons.list({ limit: 100 }))
  await upsertRecords('disputes', stripe.disputes.list({ limit: 100 }))
  await upsertRecords('plans', stripe.plans.list({ limit: 100 }))
  await upsertRecords('events', stripe.events.list({ limit: 100 }))
}
