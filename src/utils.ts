export type Record = { [Key: string]: any }

export function filterRecord(record: Record, columns: string[]) {
  return Object.fromEntries(
    columns.reduce((entries, column) => {
      entries.push([column, record[column]])
      return entries
    }, [] as Array<[string, any]>)
  )
}
