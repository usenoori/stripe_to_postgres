import { Pool, QueryResult } from 'pg'
import { getConfig } from './config'

const config = getConfig()
const pool = new Pool({ connectionString: config.DATABASE_URL })

export const query = (
  text: string,
  params?: string[]
): Promise<QueryResult> => {
  return pool.query(text, params)
}

export const stringifyArray = (obj: {
  [Key: string]: any
}): {
  [Key: string]: any
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

export const constructUpsertSql = (
  schema: string,
  table: string,
  columns: string[],
  rows: Object[],
  options?: {
    conflict?: string
  }
): { text: string; values: string[] } => {
  const { conflict = 'id' } = options || {}
  const values: string[] = []

  // language=txt
  const text = `
        insert into "${schema}"."${table}" (${columns
    .map((x) => `"${x}"`)
    .join(',')})
        values
        ${rows
          .map((row, i) => {
            const sanitized = stringifyArray(row)
            return `(${columns
              .map((column, j) => {
                values.push(sanitized[column])
                return `$${columns.length * (i + 1) - (columns.length - 1 - j)}`
              })
              .join(',')})`
          })
          .join(',')}
        on conflict (
        ${conflict}
        )
        do update set ${columns
          .map((x) => `"${x}" = excluded.${x}`)
          .join(',')};`

  return { text, values }
}

export const upsert = async <T extends { [Key: string]: any }>(
  table: string,
  columns: string[],
  rows: T[]
): Promise<T[]> => {
  const { text, values } = constructUpsertSql('stripe', table, columns, rows)
  const result = await query(text, values)
  return result.rows
}

export async function getColumns(table: string) {
  const { rows } = await query(
    'SELECT column_name FROM information_schema.columns where table_name = $1',
    [table]
  )
  const columns: string[] = rows
    .map((row) => row.column_name)
    .filter((col) => col !== 'updated_at')
  return columns
}
