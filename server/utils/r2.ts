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
  const fromEvent =
    (event as any)?.context?.cloudflare?.env?.UPLOADS ||
    (event as any)?.context?.cf?.env?.UPLOADS
  if (fromEvent) return fromEvent as R2Bucket
  const fromGlobal = (globalThis as any).UPLOADS || (globalThis as any).__env__?.UPLOADS
  if (fromGlobal) return fromGlobal as R2Bucket
  
  // If R2 not found, use dummy bucket and warn
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
  const prefix = r2PublicUrl()
  if (!prefix) return `/uploads/${key.replace(/^\/+/, '')}` // Fallback to local path
  return `${prefix}/${key.replace(/^\/+/, '')}`
}
