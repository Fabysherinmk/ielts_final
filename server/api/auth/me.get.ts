import { currentUser } from '~/server/utils/auth'
import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const u = await currentUser(event)
  if (!u) return { user: null }
  const db = useDb(event)
  const row = await db.first<any>('SELECT id, email, name, role FROM users WHERE id = ?', u.uid)
  return { user: row ?? null }
})
