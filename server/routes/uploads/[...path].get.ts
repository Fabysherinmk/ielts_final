import { useR2 } from '~/server/utils/r2'

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Missing file path' })
  }

  const r2 = useR2(event)
  const object = await r2.get(path)

  if (!object) {
    throw createError({ statusCode: 404, statusMessage: `File not found in storage: ${path}` })
  }

  // Handle standard Response (from S3 fallback client)
  if (object instanceof Response || typeof (object as any).arrayBuffer === 'function') {
    const res = object as Response
    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    setResponseHeader(event, 'content-type', contentType)
    setResponseHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
    return res.body
  }

  // Handle standard R2ObjectBody (from native CF binding)
  const contentType = object.httpMetadata?.contentType || 'application/octet-stream'
  setResponseHeader(event, 'content-type', contentType)
  setResponseHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return object.body
})
