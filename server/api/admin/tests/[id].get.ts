import { useDb } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

// Returns full test INCLUDING correct answers for admin editing.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid test id' })

  const db = useDb(event)
  const test = await db.first<any>('SELECT * FROM tests WHERE id = ?', id)
  if (!test) throw createError({ statusCode: 404, statusMessage: 'Test not found' })

  const sections = await db.all<any>(
    'SELECT * FROM sections WHERE test_id = ? ORDER BY order_index',
    id
  )

  const qIds = sections.map((s: any) => s.id)
  let questions: any[] = []
  if (qIds.length) {
    const ph = qIds.map(() => '?').join(',')
    questions = await db.all<any>(
      `SELECT * FROM questions WHERE section_id IN (${ph}) ORDER BY section_id, order_index`,
      ...qIds
    )
  }

  for (const s of sections) {
    if (s.extra_json) { try { s.extra = JSON.parse(s.extra_json) } catch {} }
    s.questions = questions
      .filter((q: any) => q.section_id === s.id)
      .map((q: any) => {
        const o: any = { ...q }
        if (q.data_json) { try { o.data = JSON.parse(q.data_json) } catch {} }
        if (q.answer_json) { try { o.answer = JSON.parse(q.answer_json) } catch {} }
        return o
      })
  }

  return { ...test, sections }
})
