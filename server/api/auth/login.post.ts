import { useDb } from '~/server/utils/db'
import { checkPassword, issueSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event)
  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }
  const db = useDb(event)
  const user = await db.first<any>('SELECT * FROM users WHERE email = ?', body.email)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  const ok = await checkPassword(body.password, user.password_hash)
  if (!ok) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  await issueSession(event, { id: user.id, role: user.role, email: user.email })
  return { id: user.id, email: user.email, name: user.name, role: user.role }
})
