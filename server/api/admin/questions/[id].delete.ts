import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb(event)
  await db.run('DELETE FROM questions WHERE id = ?', id)
  return { ok: true }
})
