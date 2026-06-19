import Database from 'better-sqlite3'
import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

// Initialize database singleton
const dbPath = resolve(process.cwd(), process.env.DB_PATH || './data/ielts.sqlite')
if (!existsSync(dirname(dbPath))) mkdirSync(dirname(dbPath), { recursive: true })
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Apply schema if needed
db.exec(readFileSync(resolve(process.cwd(), 'server/db/schema.sql'), 'utf8'))

export interface AppDb {
  /** First row or null. */
  first<T = any>(sql: string, ...args: any[]): T | null
  /** All matching rows. */
  all<T = any>(sql: string, ...args: any[]): T[]
  /** INSERT/UPDATE/DELETE with metadata. */
  run(sql: string, ...args: any[]): { lastInsertRowid: number; changes: number }
}

function useDb(): AppDb {
  return {
    first<T = any>(sql: string, ...args: any[]): T | null {
      const stmt = db.prepare(sql)
      const result = stmt.get(...args) as T
      return result || null
    },
    all<T = any>(sql: string, ...args: any[]): T[] {
      const stmt = db.prepare(sql)
      return stmt.all(...args) as T[]
    },
    run(sql: string, ...args: any[]): { lastInsertRowid: number; changes: number } {
      const stmt = db.prepare(sql)
      const result = stmt.run(...args)
      return {
        lastInsertRowid: Number(result.lastInsertRowid),
        changes: Number(result.changes)
      }
    }
  }
}

export { useDb }
