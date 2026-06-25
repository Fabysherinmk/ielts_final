// R2 storage helper.
//
// Cloudflare Workers injects the R2 bucket as a binding named `UPLOADS` (see
// wrangler.toml). In local `wrangler dev` the same binding is backed by
// a real R2 bucket (or a local emulator if you pass --r2=UPLOADS).
//
// The public URL prefix comes from runtime config (r2PublicUrl).

import type { H3Event } from 'h3'

interface R2PutOptions {
  httpMetadata?: { contentType?: string; contentDisposition?: string; cacheControl?: string }
  customMetadata?: Record<string, string>
}
interface R2Bucket {
  put: (key: string, value: ArrayBuffer | ReadableStream | Uint8Array, opts?: R2PutOptions) => Promise<any>
  delete: (key: string) => Promise<void>
  head: (key: string) => Promise<any>
  get: (key: string) => Promise<any>
}

// Dummy R2 bucket for when R2 isn't configured (so app doesn't crash)
const dummyR2: R2Bucket = {
  async put(key, value, opts) {
    console.warn('[Dummy R2] Tried to put key:', key)
    return { key, version: 'dummy' }
  },
  async delete(key) {
    console.warn('[Dummy R2] Tried to delete key:', key)
  },
  async head(key) {
    console.warn('[Dummy R2] Tried to head key:', key)
    return null
  },
  async get(key) {
    console.warn('[Dummy R2] Tried to get key:', key)
    return null
  }
}

const MISSING_R2_WARNING =
  'R2 binding "UPLOADS" is not attached. ' +
  'Uploads will use dummy storage (not persistent). ' +
  'To enable real uploads, create an R2 bucket "test-bucket" in Cloudflare and update wrangler.toml.'

export function useR2(event?: H3Event): R2Bucket {
  // 1. Check if S3 credentials are configured in Nuxt runtime config or cloudflare environment bindings
  const cfg = useRuntimeConfig(event)
  const env = (event as any)?.context?.cloudflare?.env || (event as any)?.context?.cf?.env || globalThis
  
  const accessKeyId = cfg.r2AccessKeyId || env?.R2_ACCESS_KEY_ID
  const secretAccessKey = cfg.r2SecretAccessKey || env?.R2_SECRET_ACCESS_KEY
  const endpoint = cfg.r2Endpoint || env?.R2_ENDPOINT
  const bucketName = cfg.r2BucketName || env?.R2_BUCKET_NAME || 'test-bucket'

  if (accessKeyId && secretAccessKey && endpoint) {
    return createS3Client(
      endpoint,
      bucketName,
      accessKeyId,
      secretAccessKey
    )
  }

  // 2. Fall back to native Workers R2 binding
  const fromEvent =
    (event as any)?.context?.cloudflare?.env?.UPLOADS ||
    (event as any)?.context?.cf?.env?.UPLOADS
  if (fromEvent) return fromEvent as R2Bucket
  const fromGlobal = (globalThis as any).UPLOADS || (globalThis as any).__env__?.UPLOADS
  if (fromGlobal) return fromGlobal as R2Bucket
  
  // 3. Fall back to dummy R2
  console.warn(MISSING_R2_WARNING)
  return dummyR2
}

/** Public URL prefix, e.g. https://pub-xxxxx.r2.dev */
export function r2PublicUrl(): string {
  const cfg = useRuntimeConfig()
  return String(cfg.r2PublicUrl || '').replace(/\/+$/, '')
}

/** Build the full public URL for an R2 object key. */
export function r2UrlFor(key: string): string {
  return `/uploads/${key.replace(/^\/+/, '')}`
}

// ----- S3-Compatible Lightweight R2 Client Implementation -----

let subtleCache: any = null
async function getSubtle(): Promise<any> {
  if (subtleCache) return subtleCache
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    subtleCache = globalThis.crypto.subtle
  } else {
    const { webcrypto } = await import('node:crypto')
    subtleCache = webcrypto.subtle
  }
  return subtleCache
}

async function hmac(key: ArrayBuffer | string, data: string | ArrayBuffer): Promise<ArrayBuffer> {
  const enc = new TextEncoder()
  const keyBuf = typeof key === 'string' ? enc.encode(key) : key
  const dataBuf = typeof data === 'string' ? enc.encode(data) : data
  const subtle = await getSubtle()
  const cryptoKey = await subtle.importKey(
    'raw',
    keyBuf,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return await subtle.sign('HMAC', cryptoKey, dataBuf)
}

async function sha256(data: string | ArrayBuffer): Promise<string> {
  const enc = new TextEncoder()
  const buf = typeof data === 'string' ? enc.encode(data) : data
  const subtle = await getSubtle()
  const hashBuf = await subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function getSignatureKey(secret: string, date: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmac('AWS4' + secret, date)
  const kRegion = await hmac(kDate, region)
  const kService = await hmac(kRegion, service)
  const kSigning = await hmac(kService, 'aws4_request')
  return kSigning
}

async function s3Fetch(
  method: string,
  urlStr: string,
  body: ArrayBuffer | null,
  contentType: string,
  accessKey: string,
  secretKey: string
): Promise<Response> {
  const url = new URL(urlStr)
  const host = url.host
  const path = url.pathname
  const service = 's3'
  const region = 'auto'

  const amzDate = new Date().toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z'
  const dateStamp = amzDate.substring(0, 8)

  const headers: Record<string, string> = {
    'host': host,
    'x-amz-date': amzDate,
  }
  
  if (contentType) {
    headers['content-type'] = contentType
  }

  const payloadHash = body ? await sha256(body) : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  headers['x-amz-content-sha256'] = payloadHash

  const sortedKeys = Object.keys(headers).sort()
  const canonicalHeaders = sortedKeys.map(k => `${k.toLowerCase()}:${headers[k].trim()}`).join('\n') + '\n'
  const signedHeaders = sortedKeys.map(k => k.toLowerCase()).join(';')

  const canonicalRequest = [
    method,
    path,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n')

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const hashedRequest = await sha256(canonicalRequest)
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    hashedRequest
  ].join('\n')

  const signingKey = await getSignatureKey(secretKey, dateStamp, region, service)
  const signatureBuf = await hmac(signingKey, stringToSign)
  const signature = Array.from(new Uint8Array(signatureBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const requestHeaders = new Headers(headers)
  requestHeaders.set('Authorization', authorization)

  return await fetch(urlStr, {
    method,
    headers: requestHeaders,
    body
  })
}

function createS3Client(endpoint: string, bucket: string, accessKey: string, secretKey: string): R2Bucket {
  const base = endpoint.replace(/\/+$/, '')
  const bucketUrl = `${base}/${bucket}`
  
  return {
    async put(key: string, value: ArrayBuffer | ReadableStream | Uint8Array, opts?: R2PutOptions) {
      let data: ArrayBuffer
      if (value instanceof ArrayBuffer) {
        data = value
      } else if (value instanceof Uint8Array) {
        data = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength)
      } else {
        const reader = value.getReader()
        const chunks: Uint8Array[] = []
        while (true) {
          const { done, value: chunk } = await reader.read()
          if (done) break
          if (chunk) chunks.push(chunk)
        }
        const totalLen = chunks.reduce((acc, c) => acc + c.length, 0)
        const buf = new Uint8Array(totalLen)
        let offset = 0
        for (const chunk of chunks) {
          buf.set(chunk, offset)
          offset += chunk.length
        }
        data = buf.buffer
      }
      
      const contentType = opts?.httpMetadata?.contentType || 'application/octet-stream'
      const url = `${bucketUrl}/${key.replace(/^\/+/, '')}`
      const res = await s3Fetch('PUT', url, data, contentType, accessKey, secretKey)
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`R2 S3 PUT failed: ${res.status} ${res.statusText} - ${txt}`)
      }
      return { key }
    },
    async delete(key: string) {
      const url = `${bucketUrl}/${key.replace(/^\/+/, '')}`
      const res = await s3Fetch('DELETE', url, null, '', accessKey, secretKey)
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`R2 S3 DELETE failed: ${res.status} - ${txt}`)
      }
    },
    async head(key: string) {
      const url = `${bucketUrl}/${key.replace(/^\/+/, '')}`
      const res = await s3Fetch('HEAD', url, null, '', accessKey, secretKey)
      return res.ok ? {} : null
    },
    async get(key: string) {
      const url = `${bucketUrl}/${key.replace(/^\/+/, '')}`
      const res = await s3Fetch('GET', url, null, '', accessKey, secretKey)
      return res.ok ? res : null
    }
  }
}
