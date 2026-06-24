import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDb(event)
  return db.all('SELECT * FROM tests ORDER BY skill, id')
})
