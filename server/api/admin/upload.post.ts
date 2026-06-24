import { requireAdmin } from '~/server/utils/auth'
import { useR2, r2UrlFor } from '~/server/utils/r2'
import { readMultipartFormData } from 'h3'

// Accepts multipart/form-data with a "file" part and "kind" (audio|image).
// Streams the bytes to R2 at key `{kind}/<timestamp>-<hex><ext>` and returns
// the full public URL served by pub-*.r2.dev.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })

  const kindPart = parts.find((p) => p.name === 'kind')
  const kind = kindPart?.data?.toString() || 'image'
  if (!['audio', 'image'].includes(kind)) {
    throw createError({ statusCode: 400, statusMessage: 'kind must be audio or image' })
  }
  const file = parts.find((p) => p.name === 'file')
  if (!file || !file.filename) throw createError({ statusCode: 400, statusMessage: 'file field missing' })

  // Size cap so nobody uploads a 2 GB WAV.
  if (file.data.byteLength > 60 * 1024 * 1024) {
    throw createError({ statusCode: 413, statusMessage: 'File too large (60 MB max)' })
  }

  const ext = extFromName(file.filename) || (kind === 'audio' ? '.mp3' : '.png')
  const name = `${Date.now()}-${randomHex(4)}${ext}`
  const key = `${kind}/${name}`
  const contentType = String(file.type || (kind === 'audio' ? 'audio/mpeg' : 'image/png'))

  const r2 = useR2(event)
  await r2.put(key, file.data, {
    httpMetadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: { original: file.filename, kind }
  })

  const url = r2UrlFor(key)
  return { path: url, key, filename: name, kind, contentType }
})

function extFromName(name: string): string {
  const m = /\.([A-Za-z0-9]+)$/.exec(name)
  return m ? `.${m[1].toLowerCase()}` : ''
}

function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}
