import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
// Note: getCookie/setCookie/deleteCookie are globally auto-imported by Nitro,
// so we don't re-import them here (avoids "Duplicated imports" warning).

const COOKIE = 'ielts_sess'

// Helper: encode string to base64url
function base64urlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Helper: decode base64url to string
function base64urlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return atob(str)
}

// Helper: string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

// Helper: ArrayBuffer to hex
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Simple HMAC-signed token using Web Crypto: base64(payload).base64(sig)
async function sign(payload: Record<string, any>, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const p = base64urlEncode(JSON.stringify(payload))
  const signature = await crypto.subtle.sign('HMAC', key, stringToArrayBuffer(p))
  const sig = base64urlEncode(String.fromCharCode(...new Uint8Array(signature)))
  return `${p}.${sig}`
}

async function verify(token: string, secret: string): Promise<any | null> {
  if (!token || !token.includes('.')) return null
  const [p, sig] = token.split('.')
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )
  const expectedSignature = stringToArrayBuffer(base64urlDecode(sig))
  const isValid = await crypto.subtle.verify('HMAC', key, expectedSignature, stringToArrayBuffer(p))
  if (!isValid) return null
  try { return JSON.parse(base64urlDecode(p)) } catch { return null }
}

export async function hashPassword(pw: string) { return bcrypt.hash(pw, 10) }
export async function checkPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash) }

export async function issueSession(event: H3Event, user: { id: number | string; role: string; email?: string }) {
  const cfg = useRuntimeConfig()
  const token = await sign({ uid: user.id, role: user.role, email: user.email, iat: Date.now() }, cfg.jwtSecret as string)
  setCookie(event, COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearSession(event: H3Event) { deleteCookie(event, COOKIE, { path: '/' }) }

export async function currentUser(event: H3Event): Promise<{ uid: number | string; role: string; email?: string } | null> {
  const cfg = useRuntimeConfig()
  const tok = getCookie(event, COOKIE)
  if (!tok) return null
  return await verify(tok, cfg.jwtSecret as string)
}

export async function requireAdmin(event: H3Event) {
  const u = await currentUser(event)
  if (!u || u.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Admin authentication required' })
  }
  return u
}

export function randomToken() {
  const buffer = new Uint8Array(16)
  crypto.getRandomValues(buffer)
  return arrayBufferToHex(buffer)
}
