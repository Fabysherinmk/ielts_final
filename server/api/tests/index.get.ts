import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = useDb(event)
  return await db.all(
    `SELECT id, title, skill, description, duration_min, created_at
     FROM tests t
     WHERE published = 1
     ORDER BY skill, id`
  )
})
