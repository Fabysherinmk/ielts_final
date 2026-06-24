import type { H3Event } from 'h3'

export interface AppDb {
  /** First row or null. */
  first<T = any>(sql: string, ...args: any[]): Promise<T | null>
  /** All matching rows. */
  all<T = any>(sql: string, ...args: any[]): Promise<T[]>
  /** INSERT/UPDATE/DELETE with metadata. */
  run(sql: string, ...args: any[]): Promise<{ lastInsertRowid: number; changes: number }>
  /** Prepare a statement for batch execution. */
  prepare(sql: string, ...args: any[]): any
  /** Execute statements in a batch transaction. */
  batch(stmts: any[]): Promise<any[]>
}

function useDb(event: H3Event): AppDb {
  const db = event.context.cloudflare?.env?.ielts_db
  if (!db) {
    throw new Error('D1 database binding not found (ielts_db)')
  }

  return {
    async first<T = any>(sql: string, ...args: any[]): Promise<T | null> {
      const result = await db.prepare(sql).bind(...args).first<T>()
      return result || null
    },

    async all<T = any>(sql: string, ...args: any[]): Promise<T[]> {
      const { results } = await db.prepare(sql).bind(...args).all<T>()
      return results
    },

    async run(sql: string, ...args: any[]): Promise<{ lastInsertRowid: number; changes: number }> {
      const meta = await db.prepare(sql).bind(...args).run()
      return {
        lastInsertRowid: Number(meta.lastInsertRowid ?? 0),
        changes: meta.changes ?? 0
      }
    },

    prepare(sql: string, ...args: any[]) {
      const stmt = db.prepare(sql).bind(...args)
      return {
        async run() {
          const meta = await stmt.run()
          return {
            lastInsertRowid: Number(meta.lastInsertRowid ?? 0),
            changes: meta.changes ?? 0
          }
        },
        async all() {
          const { results } = await stmt.all()
          return results
        },
        async get() {
          return await stmt.first()
        }
      }
    },

    async batch(stmts: any[]): Promise<any[]> {
      const d1Stmts = stmts.map((s) => {
        // If it's already a prepared statement (has _statement), use it
        if (s._statement) {
          return s
        }
        // Otherwise, assume it's { sql, args } or similar and create statement
        return s
      })
      return await db.batch(d1Stmts)
    }
  }
}

export { useDb }
