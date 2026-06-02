# NestJS Blog API

A REST API for a blog platform built with [NestJS](https://nestjs.com). It covers user accounts, JWT authentication (including Google sign-in), posts with metadata and tags, file uploads to object storage, and transactional email.

## Features

- **Users** — Registration, paginated listing, bulk create, profile updates
- **Authentication** — Email/password sign-in, access & refresh tokens, Google OAuth token exchange
- **Posts** — CRUD with types (`post`, `page`, `story`, `series`), statuses (`draft`, `scheduled`, `review`, `published`), slugs, and author association
- **Tags** — Create, hard delete, and soft delete
- **Meta options** — JSON metadata linked one-to-one with posts
- **Uploads** — Image upload (JPEG, PNG, GIF) to [Arvan Cloud](https://www.arvancloud.ir/en/products/cloud-storage) S3-compatible storage (AWS S3 provider also available)
- **Mail** — Welcome emails via SMTP (e.g. [Mailtrap](https://mailtrap.io) for development)
- **API docs** — OpenAPI/Swagger UI at `/api`
- **Uniform responses** — Global interceptor wraps payloads with `apiVersion` and `data`
- **Validation** — `class-validator` + Joi env validation
- **Database** — PostgreSQL with TypeORM entities and migrations

## Tech stack

| Layer | Technology |
|--------|------------|
| Runtime | Node.js 22 |
| Framework | NestJS 11 |
| Language | TypeScript |
| Database | PostgreSQL 16, TypeORM |
| Auth | JWT (`@nestjs/jwt`), bcrypt |
| Storage | AWS SDK / Arvan S3 |
| Email | `@nestjs-modules/mailer`, Nodemailer, EJS templates |
| Docs | Swagger, Compodoc |

## Prerequisites

- Node.js 18+ (22 recommended; matches Docker image)
- npm
- PostgreSQL 16 (local or Docker)
- Optional: Google OAuth client credentials, S3-compatible bucket, SMTP account

## Getting started

### 1. Clone and install

```bash
git clone <repository-url>
cd nestjs-blog
npm install
```

### 2. Environment

Copy the example file and adjust values for your machine:

```bash
cp .env.development.example .env.development
```

The app loads `.env.{NODE_ENV}` (e.g. `.env.development` when `NODE_ENV=development`). Scripts set `NODE_ENV` via `cross-env`.

| Variable | Description |
|----------|-------------|
| `DATABASE_*` | PostgreSQL host, port, user, password, name |
| `DATABASE_SYNC` | TypeORM `synchronize` (use `true` only in dev) |
| `DATABASE_AUTOLOAD` | Auto-load entities |
| `JWT_SECRET` | Signing secret for access/refresh tokens |
| `JWT_TOKEN_AUDIENCE` / `JWT_TOKEN_ISSUER` | JWT claims |
| `JWT_ACCESS_TOKEN_TTL` / `JWT_REFRESH_TOKEN_TTL` | Token lifetimes (seconds) |
| `PROFILE_API_KEY` | External profile service key |
| `API_VERSION` | Returned in every API response |
| `AWS_*` | AWS S3 settings (required by env validation) |
| `ARVAN_*` | Arvan bucket, endpoint, keys, CDN URL (used for uploads) |
| `MAIL_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD` | SMTP for transactional mail |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign-in (optional at runtime) |
| `PORT` | HTTP port (default `3000`) |

### 3. Database

Create a PostgreSQL database matching `DATABASE_NAME`, then either:

- **Development:** set `DATABASE_SYNC=true` so TypeORM creates/updates schema from entities, or  
- **Migrations:** configure `typeorm-cli.sample.config.ts`, build the project, and run TypeORM migrations from `src/migrations/`.

### 4. Run locally

```bash
# development with watch
npm run start:dev

# production build
npm run build
npm run start:prod
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

### 5. Docker Compose

Runs the API and PostgreSQL together. Ensure `.env.production` exists with the same variables as above (Compose overrides `DATABASE_HOST` to `postgres` inside the network).

```bash
docker compose up --build
```

## API overview

Most routes require a **Bearer** access token. Endpoints marked public use `@Auth(AuthType.None)`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/sign-in` | Public | Sign in with email/password |
| `POST` | `/auth/refresh-tokens` | Public | Issue new access token from refresh token |
| `POST` | `/auth/google-authentication/authenticate` | Public | Sign in or register with Google ID token |
| `POST` | `/users` | Public | Register a user |
| `GET` | `/users` | Bearer | List users (pagination: `limit`, `page`) |
| `GET` | `/users/:id` | Bearer | Get user by id |
| `POST` | `/users/create-many` | Bearer | Bulk create users |
| `PATCH` | `/users` | Bearer | Update user |
| `POST` | `/posts` | Bearer | Create post (author from token) |
| `GET` | `/posts/:userId` | Bearer | List/filter posts for a user |
| `PATCH` | `/posts` | Bearer | Update post |
| `DELETE` | `/posts?id=` | Bearer | Delete post |
| `POST` | `/tags` | Bearer | Create tag |
| `DELETE` | `/tags?id=` | Bearer | Hard delete tag |
| `DELETE` | `/tags/soft-delete?id=` | Bearer | Soft delete tag |
| `POST` | `/meta-options` | Bearer | Create meta option |
| `POST` | `/uploads/file` | Bearer | Upload image (`multipart/form-data`, field `file`) |

Example response shape (global interceptor):

```json
{
  "apiVersion": "0.0.1",
  "data": { }
}
```

HTTP request samples live under `src/**/http/*.http` (REST Client / VS Code).

## Authentication flow

1. Register via `POST /users` or authenticate with Google.
2. `POST /auth/sign-in` returns access and refresh tokens.
3. Send `Authorization: Bearer <access_token>` on protected routes.
4. When the access token expires, `POST /auth/refresh-tokens` with the refresh token.

## Project structure

```
src/
├── auth/           # JWT, guards, sign-in, Google OAuth
├── users/          # User entity, registration, pagination
├── posts/          # Posts, enums, meta-options on create
├── tags/           # Tags and post many-to-many
├── meta-options/   # Standalone meta option resource
├── uploads/        # S3/Arvan file upload
├── mail/           # SMTP + EJS templates
├── common/         # Pagination, response interceptor
├── config/         # App & database config, Joi validation
├── migrations/     # TypeORM migrations
├── app.module.ts
├── app.create.ts   # Pipes, Swagger, CORS, listen
└── main.ts
test/               # E2E tests (Jest + Supertest)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled app |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier |
| `npm test` | Unit tests |
| `npm run test:e2e` | E2E tests (uses `.env.test`) |
| `npm run test:cov` | Coverage report |
| `npm run doc` | Compodoc dev server on port 3001 |

## Testing

E2E tests bootstrap the full `AppModule` and expect a test database configured in `.env.test`. Run:

```bash
npm run test:e2e
```

## Upload storage

`UploadsService` uploads images to **Arvan Cloud** by default. To use **AWS S3** instead, switch the provider call in `src/uploads/providers/uploads.service.ts` (see comments in that file).

## License

UNLICENSED (private project).
