import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<any>(event)
  const db = useDb(event)
  const fields: string[] = []
  const vals: any[] = []
  for (const k of ['order_index', 'number', 'type', 'prompt', 'points']) {
    if (body[k] !== undefined) { fields.push(`${k} = ?`); vals.push(body[k]) }
  }
  if (body.data !== undefined) { fields.push('data_json = ?'); vals.push(JSON.stringify(body.data)) }
  if (body.answer !== undefined) { fields.push('answer_json = ?'); vals.push(JSON.stringify(body.answer)) }
  if (!fields.length) return { ok: true }
  vals.push(id)
  await db.run(`UPDATE questions SET ${fields.join(', ')} WHERE id = ?`, ...vals)
  return { ok: true }
})
