import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<{ title: string; skill: string; description?: string; duration_min?: number }>(event)
  if (!body?.title || !body?.skill) throw createError({ statusCode: 400, statusMessage: 'title and skill required' })
  if (!['reading', 'listening', 'writing', 'speaking'].includes(body.skill)) {
    throw createError({ statusCode: 400, statusMessage: 'skill must be reading|listening|writing|speaking' })
  }
  const duration = body.duration_min ?? (
    body.skill === 'reading' ? 60 :
    body.skill === 'listening' ? 40 :
    body.skill === 'writing' ? 60 : 14
  )
  const db = useDb(event)
  const info = await db.run(
    'INSERT INTO tests (title, skill, description, duration_min) VALUES (?, ?, ?, ?)',
    body.title, body.skill, body.description ?? '', duration
  )
  return { id: info.lastInsertRowid }
})
