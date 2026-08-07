# Deployment

**Status: deferred.** The original brief targeted Namecheap shared hosting
(cPanel), which assumes a MySQL database. This build uses PostgreSQL instead
(see [docs/DECISIONS.md](docs/DECISIONS.md#2-database-postgresql-not-mysqlmariadb)),
and cPanel shared hosting generally does not offer Postgres — so the
Namecheap-specific plan (phpMyAdmin import, cPanel "Setup Node.js App", etc.)
doesn't apply as written. The client asked to leave this for a later pass
once the real hosting target is decided (a Postgres-capable host, e.g. a VPS
or a managed Postgres provider, or a MySQL fallback for production).

This file will be filled in with numbered, copy-pasteable steps once that
decision is made. For now, here's what deploying *anywhere* will need:

## Building for production

```bash
# Backend
cd server
npm install
npm run build        # compiles src/ -> dist/
# Entry point for production: dist/server.js (or server/app.js, which just
# requires it — see docs/DECISIONS.md #3 for why that shim exists).

# Frontend
cd client
npm install
npm run build         # outputs client/dist/ as static files
```

## Required environment variables (production)

**server/.env**
- `DATABASE_URL` — production Postgres connection string
- `JWT_SECRET` — a long random string, different from dev
- `CORS_ORIGIN` — the deployed frontend's origin
- `COOKIE_NAME`, `PORT`, `NODE_ENV=production`

**client/.env** (baked in at build time)
- `VITE_API_URL` — the deployed API's origin + `/api` (never `localhost`)
- `VITE_DEV_AUTO_LOGIN=false` — must stay `false` in any real deployment

## Database

Run migrations against the production database once, then seed (or import a
`pg_dump` if migrating existing data):

```bash
npx prisma migrate deploy
npm run prisma:seed   # optional — creates the seeded admin + sample users
```

## SPA routing

Whatever serves `client/dist/` needs a fallback to `index.html` for deep
links (e.g. `/users/5/edit` on a hard refresh) — an Nginx `try_files`
directive, an `.htaccess` rewrite, or the static host's built-in SPA mode,
depending on where this ends up.
