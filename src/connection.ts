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
