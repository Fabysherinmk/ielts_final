import { useDb } from '~/server/utils/db'
import { currentUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ test_id: number }>(event)
  if (!body?.test_id) throw createError({ statusCode: 400, statusMessage: 'test_id required' })
  const db = useDb(event)
  const test = await db.first<any>(
    'SELECT id FROM tests WHERE id = ? AND published = 1',
    body.test_id
  )
  if (!test) throw createError({ statusCode: 404, statusMessage: 'Test not found' })
  const u = await currentUser(event)
  const info = await db.run(
    'INSERT INTO attempts (user_id, test_id) VALUES (?, ?)',
    u ? u.uid : null, body.test_id
  )
  return { attempt_id: info.lastInsertRowid }
})
