import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<any>(event)
  const db = useDb(event)
  const fields: string[] = []
  const vals: any[] = []
  for (const key of ['title', 'instructions', 'body', 'audio_path', 'image_path', 'order_index']) {
    if (body[key] !== undefined) { fields.push(`${key} = ?`); vals.push(body[key]) }
  }
  if (body.extra !== undefined) { fields.push('extra_json = ?'); vals.push(JSON.stringify(body.extra)) }
  if (!fields.length) return { ok: true }
  vals.push(id)
  await db.run(`UPDATE sections SET ${fields.join(', ')} WHERE id = ?`, ...vals)
  return { ok: true }
})
