import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<any>(event)
  if (!body?.test_id) throw createError({ statusCode: 400, statusMessage: 'test_id required' })
  const db = useDb(event)
  const maxOrder = await db.first<any>(
    'SELECT COALESCE(MAX(order_index), -1) AS m FROM sections WHERE test_id = ?',
    body.test_id
  )
  const info = await db.run(
    `INSERT INTO sections (test_id, order_index, title, instructions, body, audio_path, image_path, extra_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    body.test_id,
    body.order_index ?? ((maxOrder?.m ?? -1) + 1),
    body.title ?? '',
    body.instructions ?? '',
    body.body ?? '',
    body.audio_path ?? null,
    body.image_path ?? null,
    body.extra ? JSON.stringify(body.extra) : null
  )
  return { id: info.lastInsertRowid }
})
