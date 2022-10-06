import Stripe from 'stripe'
import { getConfig } from './config'
import { pg as sql } from 'yesql'
import { query } from './connection'

const config = getConfig()

export const constructUpsertSql = (
  schema: string,
  table: string,
  columns: string[],
  options?: {
    conflict?: string
  }
): string => {
  const { conflict = 'id' } = options || {}

  return `
        insert into "${schema}"."${table}" (${columns
    .map((x) => `"${x}"`)
    .join(',')})
        values (${columns.map((x) => `:${x}`).join(',')})
        on conflict (
            ${conflict}
            )
            do update set ${columns.map((x) => `"${x}" = :${x}`).join(',')}
        ;`
}

export const cleanseArrayField = (obj: {
  [Key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}): {
  [Key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
} => {
  const cleansed = { ...obj }
  Object.keys(cleansed).map((k) => {
    const data = cleansed[k]
    if (Array.isArray(data)) {
      cleansed[k] = JSON.stringify(data)
    }
  })
  return cleansed
}

export const upsert = async <T extends { [Key: string]: any }>(
  table: string,
  columns: string[],
  data: T
): Promise<T[]> => {
  const upsertString = constructUpsertSql('stripe', table, columns)

  const cleansed = cleanseArrayField(data)
  const prepared = sql(upsertString)(cleansed)

  const { rows } = await query(prepared.text, prepared.values)
  return rows
}

async function getColumns(table: string) {
  const { rows } = await query(
    'SELECT column_name FROM information_schema.columns where table_name = $1',
    [table]
  )
  const columns: string[] = rows
    .map((row) => row.column_name)
    .filter((col) => col !== 'updated_at')
  return columns
}

async function upsertRecords<T extends { [Key: string]: any }>(
  table: string,
  resource: Stripe.ApiListPromise<T>
) {
  const columns = await getColumns(table)

  console.log(`Upserting ${table}`)
  let counter = 0
  for await (const record of resource) {
    // Keep only fields that we handle
    const data = Object.fromEntries(
      columns.reduce((entries, column) => {
        entries.push([column, record[column]])
        return entries
      }, [] as Array<[string, { [Key: string]: any }]>)
    )

    await upsert(table, columns, data)
    counter++
  }
  console.log(`Upserted ${counter} ${table}`)
}

export async function runSync() {
  const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01',
  })

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
