import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid test id' })
  const db = useDb(event)
  
  // Get test info
  const test = await db.first<any>(
    'SELECT id, title, skill, description, duration_min FROM tests WHERE id = ? AND published = 1',
    id
  )
  if (!test) throw createError({ statusCode: 404, statusMessage: 'Test not found' })

  // Get sections with questions (including answers)
  const sections = await db.all<any>(
    `SELECT id, order_index, title, instructions, body, audio_path, image_path, extra_json
     FROM sections WHERE test_id = ? ORDER BY order_index`,
    id
  )
  const sectionIds = sections.map((s: any) => s.id)
  let questions: any[] = []
  if (sectionIds.length) {
    const ph = sectionIds.map(() => '?').join(',')
    questions = await db.all<any>(
      `SELECT id, section_id, order_index, number, type, prompt, data_json, answer_json, points
       FROM questions WHERE section_id IN (${ph})
       ORDER BY section_id, order_index`,
      ...sectionIds
    )
  }

  // Parse JSON fields
  for (const s of sections) {
    if (s.extra_json) { try { s.extra = JSON.parse(s.extra_json) } catch {} }
    delete s.extra_json
    s.questions = questions
      .filter((q: any) => q.section_id === s.id)
      .map((q: any) => {
        const parsed: any = { ...q }
        if (q.data_json) { try { parsed.data = JSON.parse(q.data_json) } catch {} }
        if (q.answer_json) { try { parsed.answer = JSON.parse(q.answer_json) } catch {} }
        delete parsed.data_json
        delete parsed.answer_json
        return parsed
      })
  }

  return { ...test, sections }
})
