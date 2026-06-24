// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'IELTS Mock Test Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Full IELTS mock test platform - Reading, Listening, Writing, Speaking' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  runtimeConfig: {
    // Secrets — override via Cloudflare Pages env vars, or .dev.vars locally.
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production-supersecret',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    // Public URL R2 serves uploads from.
    r2PublicUrl: process.env.R2_PUBLIC_URL || 'https://pub-14064a4af44e450d8aa584606b77ceb4.r2.dev',
    // S3-compatible R2 storage configuration (external account)
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    r2Endpoint: process.env.R2_ENDPOINT || '',
    r2BucketName: process.env.R2_BUCKET_NAME || 'test-bucket',
    public: {
      appName: 'IELTS Mock Test Platform'
    }
  },
  nitro: {
    // Deploy target: Cloudflare Workers. DB is D1, uploads are R2 — both via bindings
    // injected at runtime.
    preset: 'cloudflare_module',
    experimental: {
      asyncContext: true
    }
  }
})
