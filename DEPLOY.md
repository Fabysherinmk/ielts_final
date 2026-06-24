# Deploying to Cloudflare (Pages + D1 + R2)
# Fixed deployment config for Pages

This app runs on a full Cloudflare stack:

- **Cloudflare Pages** — hosts the Nuxt app (SSR via Nitro `cloudflare-pages` preset)
- **Cloudflare D1** — SQL database (binding: `ielts_db`, db name: `ielts-db`)
- **Cloudflare R2** — object storage for audio + images (binding: `UPLOADS`, bucket: `test-bucket`)

**No API keys or access-key signatures are needed in the app code.** Pages injects D1 and R2 as bindings at runtime; authorization is granted because the Pages project, the D1 database, and the R2 bucket live under the same Cloudflare account. Your R2 S3-compatible keys are only useful for *external* tools (rclone, `aws s3`, etc.), not for this app.

---

## 0. One-time setup on your dev machine

```powershell
# From D:\real ielts\ielts-platform
npm install
npm install -g wrangler     # or use `npx wrangler ...`
wrangler login              # opens a browser, authorizes with your Cloudflare account
```

`wrangler.toml` is already committed with your D1 and R2 bindings.  
Secrets for local dev live in `.dev.vars` (gitignored).

---

## 1. Push the schema to D1 (once)

Your empty D1 database `ielts-db` already exists — we just need to create the tables:

```powershell
npm run d1:schema
```

That runs `wrangler d1 execute ielts-db --remote --file=./server/db/schema.sql`.

Verify:

```powershell
npx wrangler d1 execute ielts-db --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

You should see: `users`, `tests`, `sections`, `questions`, `attempts`, `answers`.

---

## 2. Seed the database

The seed runs locally against a temporary SQLite file (`data/ielts.sqlite`), dumps it to `data/seed.sql`, and pushes that SQL to remote D1:

```powershell
npm run d1:seed
```

Under the hood:

1. `npm run seed:local-sqlite` — runs `scripts/seed.ts` → writes to `data/ielts.sqlite`
2. `node scripts/dump-d1-sql.ts` — dumps rows to `data/seed.sql`
3. `wrangler d1 execute ielts-db --remote --file=./data/seed.sql` — pushes to D1

After this the admin user and all four Cambridge-style mock tests (Reading, Listening, Writing, Speaking) are live in D1.

Admin login:

- email: `admin@ielts.local`
- password: `admin123` (override with `ADMIN_PASSWORD` — see §4)

---

## 3. Build and deploy to Pages

First time — create the Pages project:

```powershell
npm run build
npx wrangler pages project create ielts-platform --production-branch main
```

Every deploy after that:

```powershell
npm run deploy
```

That runs `nuxt build` then `wrangler pages deploy .output/public --project-name=ielts-platform`.

Wrangler will print a URL like `https://ielts-platform.pages.dev` — that's your live app.

---

## 4. Set production secrets

`.dev.vars` only applies to local `wrangler pages dev`. For the deployed site, set secrets on the Pages project:

```powershell
npx wrangler pages secret put JWT_SECRET       --project-name ielts-platform
npx wrangler pages secret put ADMIN_PASSWORD   --project-name ielts-platform
```

Enter a strong value when prompted. Redeploy afterwards so the new env is picked up.

You can also set them in the dashboard:  
Cloudflare → Workers & Pages → `ielts-platform` → Settings → Environment variables → Production.

The public, non-secret variable `R2_PUBLIC_URL` is already declared in `wrangler.toml` under `[vars]`.

---

## 5. Local preview with real bindings

`nuxt dev` alone does **not** have D1/R2 bindings — any request that hits the database or uploads will 503 with `D1_NO_BINDING` / `R2_NO_BINDING`.

To test locally exactly how it runs in production:

```powershell
npm run preview
```

That runs `nuxt build` then `wrangler pages dev .output/public`, which binds to a **local** D1 SQLite file and a **local** R2 emulator.

Seed the local D1 once:

```powershell
npm run d1:schema:local
npm run d1:seed:local
```

Visit `http://localhost:8788`.

---

## 6. Useful commands

```powershell
# Run an ad-hoc SQL query on remote D1
npx wrangler d1 execute ielts-db --remote --command "SELECT id, title, skill FROM tests"

# Tail production logs
npx wrangler pages deployment tail --project-name ielts-platform

# List R2 objects
npx wrangler r2 object list test-bucket

# Reset D1 entirely (drops tables, re-runs schema + seed)
npm run d1:reset
```

---

## Troubleshooting

**Error: `D1_NO_BINDING` or `R2_NO_BINDING`**  
You're running `nuxt dev`, not `wrangler pages dev`. Bindings only exist under wrangler. Use `npm run preview` or deploy to Pages.

**Error: `no such table: users`**  
Schema wasn't pushed. Run `npm run d1:schema`.

**Build fails with `Cannot find module 'better-sqlite3'`**  
`better-sqlite3` is now a devDependency — used only by local scripts (`seed.ts`, `dump-d1-sql.ts`, `reset-db.ts`), never in the Nuxt server bundle. If you see this during `nuxt build`, something in `server/` is still importing it — grep for `better-sqlite3` and replace with `useDb(event)` from `~/server/utils/db.ts`.

**Audio uploads 503 with `R2_NO_BINDING` in Pages**  
The Pages project isn't bound to the R2 bucket. Open the Pages dashboard → Settings → Functions → R2 bucket bindings → add `UPLOADS` → `test-bucket`. Same for D1 under D1 database bindings (`ielts_db` → `ielts-db`). Normally `wrangler.toml` handles this automatically on first deploy.

**R2 URLs return 403**  
Public access isn't enabled on the bucket. Cloudflare dashboard → R2 → `test-bucket` → Settings → Public access → enable the `r2.dev` subdomain. Your current URL is `https://pub-14064a4af44e450d8aa584606b77ceb4.r2.dev`.
