# API Reference

Base URL: `/api` (e.g. `http://localhost:4000/api` in local dev).

All responses are JSON. Successful responses:

```json
{ "success": true, "data": { ... }, "message": "..." }
```

Paginated list responses:

```json
{ "success": true, "data": [ ... ], "meta": { "current_page": 1, "per_page": 15, "total": 42, "last_page": 3 } }
```

Errors:

```json
{ "success": false, "message": "...", "errors": { "field": ["..."] } }
```

Auth uses an httpOnly cookie (`besttech_token` by default) set on login — the
frontend sends it automatically via `withCredentials`. There is no `Authorization`
header; a request without a valid cookie gets `401`.

---

## Auth

### `POST /api/auth/login`
Auth: none. Rate-limited to 5 requests/minute/IP.

Request body:
```json
{ "email": "admin@besttech.com", "password": "Admin@123" }
```

Response `200`:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "id": 1,
    "name": "System Administrator",
    "email": "admin@besttech.com",
    "phone": null,
    "avatarUrl": null,
    "status": "active",
    "lastLoginAt": "2026-01-01T12:00:00.000Z",
    "createdAt": "2026-01-01T09:00:00.000Z",
    "role": { "id": 1, "name": "super_admin", "displayName": "Super Admin" }
  }
}
```

Response `401` (wrong email/password) or `429` (rate limited).

### `POST /api/auth/logout`
Auth: none (safe to call whether or not a session is active). Clears the auth cookie.

### `GET /api/auth/me`
Auth: required. Returns the current user, same shape as login's `data`.

### `PUT /api/auth/me`
Auth: required. Any authenticated user can update their own profile — this
does **not** go through the users-module RBAC (`super_admin`/`admin` only),
since every role needs to edit their own profile.

Request body (all optional):
```json
{ "name": "New Name", "phone": "+1-555-0100", "currentPassword": "Admin@123", "newPassword": "NewPass@123" }
```
`currentPassword` is required if `newPassword` is present. Response `200` with the updated user, or `422` with field errors.

---

## Users

All routes below require auth **and** `super_admin` or `admin` role — others get `403`.

### `GET /api/users`
Query params: `search`, `role` (role name), `status` (`active`/`inactive`),
`page` (default 1), `per_page` (default 15, max 100), `sort`
(`name`|`email`|`createdAt`|`lastLoginAt`, default `createdAt`), `direction`
(`asc`|`desc`, default `desc`).

Response `200`: paginated list of users (same shape as login's `data`, one per row).

### `POST /api/users`
Request body:
```json
{ "name": "Jane Doe", "email": "jane@besttech.com", "password": "Password123", "roleId": 3, "phone": "+1-555-0100", "status": "active" }
```
`phone` and `status` are optional. Response `201` with the created user, or `422` with field errors (e.g. duplicate email).

### `GET /api/users/:id`
Response `200` with the user, or `404`.

### `PUT /api/users/:id`
Request body: any subset of `name`, `email`, `password`, `roleId`, `phone`, `status`.
Response `200` with the updated user. `403` if an `admin` tries to modify a `super_admin` account.

### `DELETE /api/users/:id`
Soft delete (`deletedAt` set; the row is not removed). Response `204` (no body).

### `PATCH /api/users/:id/status`
Request body: `{ "status": "inactive" }`. Response `200` with the updated user.

---

## Roles

### `GET /api/roles`
Auth: required, `super_admin`/`admin` only. Returns all roles (`id`, `name`, `displayName`) for use in dropdowns.

---

## Dashboard

### `GET /api/dashboard/stats`
Auth: required, any internal role (`super_admin`/`admin`/`staff`).

Response `200`:
```json
{
  "success": true,
  "data": {
    "totalUsers": 11,
    "activeUsers": 9,
    "totalRoles": 4,
    "inventory": { "totalProducts": 0, "totalWarehouses": 0, "lowStockItems": 0 }
  }
}
```
`inventory` reflects the (currently empty) future-module schema, not live stock — the Inventory module itself isn't built yet.

---

## Health check

### `GET /api/health`
Auth: none. Returns `{ "success": true, "data": { "status": "ok" } }`. Useful for deployment smoke tests.
