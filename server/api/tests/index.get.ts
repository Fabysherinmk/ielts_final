import { useDb } from '~/server/utils/db'

export default defineEventHandler((event) => {
  const db = useDb()
  return db.all(
    `SELECT id, title, skill, description, duration_min, created_at
     FROM tests t
     WHERE published = 1
     ORDER BY skill, id`
  )
})
