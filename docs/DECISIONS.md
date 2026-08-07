# Technical decisions

## 1. Roles: Super Admin / Admin / Staff / Client (not admin/manager/operator/viewer)

The original build brief's DB schema section specified four generic roles
(`admin`, `manager`, `operator`, `viewer`). The client's actual requirements
doc (`BestTech_Website_and_Software_Requirements.docx`) defines a different,
more specific set — **Super Admin, Admin, Staff, Client** — with a detailed
permissions matrix (Section 5 of that doc) and the note that Super Admin was
added as "a recommended higher-level owner role."

Since the requirements doc is the source of truth when it conflicts with the
generic brief, the schema and RBAC middleware use the docx's roles instead.

**Where this shows up:** `prisma/schema.prisma` seeds these four roles;
`src/constants/roles.ts` defines `USER_MANAGER_ROLES = [super_admin, admin]`
matching the docx's "User Management" row (Staff and Client have no access to
user management); `users.service.ts` additionally blocks Admin from
modifying Super Admin accounts, per the docx's role-restrictions section.

**Client is a portal role, not built yet.** The docx's Client role is an
*external* portal user (own invoices/shipments only) — a different app
surface than this internal admin dashboard. Phase 1 seeds Client as data (so
Admin/Super Admin can already create client records via the Users module,
matching the docx's permissions matrix) but there is no client-facing login
or portal UI yet. That's future-module work, same as Inventory/CRM/Logistics.

## 2. Database: PostgreSQL, not MySQL/MariaDB

The original brief's hard constraints specified local MySQL/MariaDB
specifically (partly because of the Namecheap/cPanel deployment target, which
supports MySQL natively via phpMyAdmin). The client asked to switch to
Postgres instead and said not to worry about testing it against a live DB for
now — just wire the code up.

**Consequence:** `prisma/schema.prisma`'s datasource is `postgresql`, and
`.env.example` uses a `postgresql://` connection string. Prisma's native
column types (`@db.VarChar`, `@db.Text`, etc.) work the same way under both
connectors, so the schema itself didn't need structural changes beyond the
provider line.

**This directly conflicts with the Namecheap/cPanel deployment plan** (see
next decision) — cPanel shared hosting generally only offers MySQL/MariaDB
databases, not Postgres.

## 3. Deployment target deferred (Namecheap/cPanel work not done)

Because of decision #2, the original Section 10 deployment plan (build
locally, import a `database/seed.sql` dump via phpMyAdmin, configure cPanel's
"Setup Node.js App" / Passenger) no longer fits: Postgres isn't available on
typical Namecheap shared hosting.

The client explicitly said to leave the Namecheap deployment work for later
and focus on getting the backend ready and the repo onto GitHub. `DEPLOYMENT.md`
in this repo is intentionally a placeholder rather than a fully worked-out
guide — revisit it once the actual hosting target (a Postgres-capable host,
or a MySQL fallback for production) is decided.

The backend is still structured defensively for a cPanel/Passenger-style
target in case that changes back: `server/app.js` is a plain CommonJS file at
the app root (`require("./dist/server.js")`) rather than relying on
TypeScript being runnable in place, since Passenger executes a JS file
directly and does not run a build step.

## 4. No public marketing website in this repo

The requirements doc also describes a full public marketing site (Home,
About, Services, per-product pages, Case Studies, Blog, Contact form with
EmailJS). That site already exists separately at besttcherpcore.netlify.app.
This repo is the internal ERP/admin application only — login, dashboard, user
management, and the schema/stubs for future modules. Building the marketing
site (and resolving the EmailJS-vs-"no third-party SaaS" conflict that would
come with it) is a separate piece of work, not Phase 1.

## 5. Password hashing: bcryptjs, not bcrypt

`bcrypt` ships a native binary that has to be compiled for the exact OS/arch
it runs on. Since builds happen locally (Windows, per the original brief's
"no shell access on the server" deployment note) and would need to run on a
Linux server, a native module built on Windows would not load there.
`bcryptjs` is a pure-JS, API-compatible implementation — no native compile
step, no OS mismatch risk — at the cost of being somewhat slower under heavy
load, which doesn't matter at Phase 1's scale.

## 6. Lightweight RBAC: role-name checks now, permissions table seeded for later

The brief asked for a "simple RBAC... don't pull in a heavy permissions
package." Phase 1 route protection checks `req.user.roleName` directly
(`requireRole(...ROLES)` middleware) rather than querying the
`permissions`/`role_permission` tables per request. Those tables are seeded
with real data (see `prisma/seed.ts`) so finer-grained, per-permission checks
can be added later without a schema change — they're just not on the
request path yet, since Phase 1's access rules are all expressible as
"which roles can touch this route."

## 7. Validation errors keyed by field name (zod)

All request validation uses `zod`. `parseOrThrow()` (`src/validators/validate.ts`)
converts a failed `safeParse` into the API's standard
`{ success: false, errors: { field: ["message"] } }` shape, matching the
brief's response conventions and letting the frontend render per-field 422
errors without any bespoke mapping.

## 8. Automated tests use a mocked Prisma client

The Jest suite (`server/tests/`) mocks `src/config/prisma` rather than
hitting a real database. This means the tests: (a) prove the auth and user
CRUD logic (login success/failure, RBAC enforcement, validation, soft delete)
without needing a Postgres instance in CI or on a fresh clone, and (b) don't
verify Prisma's actual SQL generation or Postgres-specific behavior — that
still requires a real `prisma migrate dev` + manual smoke test once Postgres
is running locally.
