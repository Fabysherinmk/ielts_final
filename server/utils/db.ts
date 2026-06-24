import type { H3Event } from 'h3'

// Detect if we're in development mode (using local SQLite) or production (using Cloudflare D1)
const isDev = process.env.NODE_ENV !== 'production'

// Local SQLite implementation (for npm run dev)
let localDb: any = null
async function getLocalDb() {
  if (localDb) return localDb
  const Database = (await import('better-sqlite3')).default
  const { resolve } = await import('node:path')
  const { readFileSync, existsSync, mkdirSync } = await import('node:fs')

  const dbPath = resolve(process.cwd(), './data/ielts.sqlite')
  const dataDir = resolve(process.cwd(), './data')
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })

  localDb = new Database(dbPath)
  localDb.pragma('journal_mode = WAL')
  localDb.pragma('foreign_keys = ON')

  // Apply schema if needed
  const schemaPath = resolve(process.cwd(), './server/db/schema.sql')
  localDb.exec(readFileSync(schemaPath, 'utf8'))

  return localDb
}

// Type declarations for Cloudflare D1 (to fix TypeScript errors)
interface D1Database {
  prepare(sql: string): D1PreparedStatement
  batch<T = any>(statements: D1PreparedStatement[]): Promise<T[]>
  dump(): Promise<ArrayBuffer>
  exec(sql: string): Promise<D1Result>
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement
  first<T = any>(column?: string): Promise<T | null>
  run(): Promise<D1Result>
  all<T = any>(): Promise<D1Result<T>>
  raw<T = any>(): Promise<T[]>
}

interface D1Result<T = any> {
  success: boolean
  meta?: any
  results?: T[]
  lastInsertRowid?: number | null
  changes?: number
  duration?: number
  served_by?: string
}

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

function useDb(event?: H3Event): AppDb {
  if (isDev) {
    // Local SQLite implementation for dev mode
    return {
      async first<T = any>(sql: string, ...args: any[]): Promise<T | null> {
        const db = await getLocalDb()
        return db.prepare(sql).get(...args) || null
      },
      async all<T = any>(sql: string, ...args: any[]): Promise<T[]> {
        const db = await getLocalDb()
        return db.prepare(sql).all(...args)
      },
      async run(sql: string, ...args: any[]): Promise<{ lastInsertRowid: number; changes: number }> {
        const db = await getLocalDb()
        const result = db.prepare(sql).run(...args)
        return {
          lastInsertRowid: Number(result.lastInsertRowid ?? 0),
          changes: result.changes ?? 0
        }
      },
      prepare(sql: string, ...args: any[]) {
        // For compatibility with D1 prepared statements
        let boundArgs = args
        return {
          bind(...newArgs: any[]) {
            boundArgs = [...boundArgs, ...newArgs]
            return this
          },
          async run() {
            const db = await getLocalDb()
            const result = db.prepare(sql).run(...boundArgs)
            return {
              lastInsertRowid: Number(result.lastInsertRowid ?? 0),
              changes: result.changes ?? 0
            }
          },
          async all() {
            const db = await getLocalDb()
            return db.prepare(sql).all(...boundArgs)
          },
          async get() {
            const db = await getLocalDb()
            return db.prepare(sql).get(...boundArgs)
          },
          async first() {
            const db = await getLocalDb()
            return db.prepare(sql).get(...boundArgs)
          },
          // Add a flag to identify prepared statements for batch
          _statement: true,
          _sql: sql,
          _args: boundArgs
        }
      },
      async batch(stmts: any[]): Promise<any[]> {
        const db = await getLocalDb()
        const results: any[] = []
        try {
          db.exec('BEGIN TRANSACTION')
          for (const stmt of stmts) {
            if (stmt._statement) {
              // It's a prepared statement from our prepare() method
              const result = db.prepare(stmt._sql).run(...stmt._args)
              results.push(result)
            } else if (typeof stmt === 'object' && stmt.sql) {
              // It's a { sql, args } object
              const result = db.prepare(stmt.sql).run(...(stmt.args || []))
              results.push(result)
            }
          }
          db.exec('COMMIT')
        } catch (e) {
          db.exec('ROLLBACK')
          throw e
        }
        return results
      }
    }
  } else {
    // Cloudflare D1 implementation for production
    if (!event) {
      throw new Error('Event is required to access D1 database in production')
    }
    const db = event.context.cloudflare?.env?.ielts_db as unknown as D1Database
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
        return results || []
      },
      async run(sql: string, ...args: any[]): Promise<{ lastInsertRowid: number; changes: number }> {
        const result = await db.prepare(sql).bind(...args).run()
        return {
          lastInsertRowid: Number(result.meta?.last_row_id ?? result.lastInsertRowid ?? 0),
          changes: result.meta?.changes ?? result.changes ?? 0
        }
      },
      prepare(sql: string, ...args: any[]) {
        const stmt = db.prepare(sql).bind(...args)
        return {
          async run() {
            const result = await stmt.run()
            return {
              lastInsertRowid: Number(result.meta?.last_row_id ?? result.lastInsertRowid ?? 0),
              changes: result.meta?.changes ?? result.changes ?? 0
            }
          },
          async all() {
            const { results } = await stmt.all()
            return results || []
          },
          async get() {
            return await stmt.first()
          },
          _statement: true,
          _stmt: stmt
        }
      },
      async batch(stmts: any[]): Promise<any[]> {
        const d1Stmts = stmts.map((s) => {
          if (s._statement && s._stmt) return s._stmt
          if (s._statement) return s
          if (typeof s === 'object' && s.sql) {
            return db.prepare(s.sql).bind(...(s.args || []))
          }
          return s
        }) as unknown as D1PreparedStatement[]
        return await db.batch(d1Stmts)
      }
    }
  }
}

export { useDb }
