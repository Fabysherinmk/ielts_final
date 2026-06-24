import { issueSession } from '~/server/utils/auth'

// Simple admin password gate. Password from runtime config.
export default defineEventHandler(async (event) => {
  const body = await readBody<{ password: string }>(event)
  const cfg = useRuntimeConfig()
  if (!body?.password || body.password !== cfg.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid admin password' })
  }
  await issueSession(event, { id: 'admin', role: 'admin', email: 'admin@local' })
  return { ok: true, role: 'admin' }
})
