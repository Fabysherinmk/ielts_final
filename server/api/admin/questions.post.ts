import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

// Accepts single question OR { questions: [...] } for bulk upload.
// Uses D1 batch so all inserts are atomic.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<any>(event)
  const list = Array.isArray(body?.questions) ? body.questions : [body]

  const db = useDb(event)
  const stmts: any[] = []
  const sql = `INSERT INTO questions (section_id, order_index, number, type, prompt, data_json, answer_json, points)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  for (const q of list) {
    if (!q?.section_id || !q?.type) throw createError({ statusCode: 400, statusMessage: 'Each question needs section_id and type' })
    stmts.push(db.prepare(
      sql,
      q.section_id,
      q.order_index ?? 0,
      q.number ?? null,
      q.type,
      q.prompt ?? '',
      q.data !== undefined ? JSON.stringify(q.data) : (q.data_json ?? null),
      q.answer !== undefined ? JSON.stringify(q.answer) : (q.answer_json ?? null),
      q.points ?? 1
    ))
  }

  const results = await db.batch(stmts)
  const ids = results.map((r) => r.lastInsertRowid)
  return { ids, count: ids.length }
})
