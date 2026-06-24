import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<any>(event)
  const db = useDb(event)
  const fields: string[] = []
  const vals: any[] = []
  for (const key of ['title', 'description', 'duration_min', 'published']) {
    if (body[key] !== undefined) { fields.push(`${key} = ?`); vals.push(body[key]) }
  }
  if (!fields.length) return { ok: true }
  vals.push(id)
  await db.run(`UPDATE tests SET ${fields.join(', ')} WHERE id = ?`, ...vals)
  return { ok: true }
})
