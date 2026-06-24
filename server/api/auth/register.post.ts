import { useDb } from '~/server/utils/db'
import { hashPassword, issueSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string; name?: string }>(event)
  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }
  const db = useDb(event)
  const exists = await db.first<any>('SELECT 1 AS ok FROM users WHERE email = ?', body.email)
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  const hash = await hashPassword(body.password)
  const info = await db.run(
    'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)',
    body.email, body.name ?? '', hash, 'student'
  )
  await issueSession(event, { id: info.lastInsertRowid, role: 'student', email: body.email })
  return { id: info.lastInsertRowid, email: body.email, role: 'student' }
})
