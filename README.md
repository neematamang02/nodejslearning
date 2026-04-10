# Node.js Learning API

A production-style REST API built with Express, MongoDB, Redis, JWT authentication, OTP email verification, and structured response/error handling.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Redis
- JWT (access + refresh tokens)
- Zod validation
- Nodemailer (OTP email)
- Pino logging

## Features

- User registration with OTP verification flow
- Login with JWT access token and refresh token cookie
- Refresh access token endpoint
- Logout and logout-from-all-devices support
- Role-based authorization (`user`, `admin`)
- User profile endpoints (`/me`)
- Admin user management endpoints
- Search, filter, sort, field selection, pagination
- Consistent API response format
- Centralized error middleware

## Project Structure

```text
.
├── config/
├── controllers/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
├── validators/
└── server.js
```

## Prerequisites

- Node.js 18+
- MongoDB instance
- Redis instance
- SMTP email account (for OTP)

## Installation

```bash
pnpm install
```

If you prefer npm:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/nodejslearning

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXP=15m
REFRESH_TOKEN_EXP=7d

REDIS_URL=redis://localhost:6379

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

LOG_LEVEL=debug
GIT_COMMIT=local
```

### Required Variables

- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

## Run the Project

Development mode:

```bash
pnpm dev
```

Production mode:

```bash
pnpm start
```

Server starts on:

- `http://localhost:3000` (or your configured `PORT`)

## API Base Paths

- Auth APIs: `/api`
- User APIs: `/user`

## Authentication Flow

1. Register user using `/api/register`.
2. Verify OTP using `/api/verify`.
3. Login using `/api/login`.
4. Receive:
   - Access token in JSON response.
   - Refresh token in HTTP-only cookie.
5. Send access token in header for protected routes:
   - `Authorization: Bearer <access_token>`

## API Endpoints

### Auth Routes

- `POST /api/register` - Register and send OTP
- `POST /api/verify` - Verify OTP and create account
- `POST /api/login` - Login user
- `POST /api/refresh` - Refresh access token using refresh cookie
- `POST /api/logout` - Clear refresh token cookie
- `POST /api/logoutall` - Invalidate tokens for all sessions

### User Routes

Public/general:

- `GET /user` - List users with query features
- `GET /user/secret` - Sample secret data route

Authenticated user:

- `GET /user/me` - Get current user profile
- `PUT /user/me` - Update current user profile
- `DELETE /user/me` - Delete current user account

Admin only:

- `GET /user/admin` - Admin test route
- `GET /user/:id` - Get user by id
- `PUT /user/:id` - Update user by id
- `DELETE /user/:id` - Delete user by id

## Query Features on `GET /user`

Supported query params:

- `search` - Search by name/email
- `page` - Page number (default: `1`)
- `limit` - Items per page (default: `10`)
- `sort` - Sort fields (e.g. `-createdAt`, `name`)
- `fields` - Select fields (e.g. `name,email`)
- Advanced filters with operators:
  - `gte`, `gt`, `lte`, `lt`

Examples:

```http
GET /user?search=john&page=1&limit=10
GET /user?sort=-createdAt&fields=name,email
GET /user?age[gte]=18&age[lte]=65
```

## Response Format

Success response:

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": { "users": [] },
  "error": null,
  "meta": {
    "timestamp": "2026-04-10T10:30:00.000Z"
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "error": {
    "code": "USER_NOT_FOUND",
    "statusCode": 404,
    "details": null
  },
  "meta": {
    "timestamp": "2026-04-10T10:30:00.000Z"
  }
}
```

## Quick cURL Examples

Register:

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Verify OTP:

```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

Login:

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Get my profile (replace token):

```bash
curl http://localhost:3000/user/me \
  -H "Authorization: Bearer <access_token>"
```

## Validation and Security Notes

- Request body validation uses Zod.
- Passwords are hashed with bcrypt.
- Refresh token is stored in HTTP-only cookie.
- Role-based protection is applied on admin routes.

## Logging

- HTTP and app logging are configured with Pino.
- Log level can be controlled via `LOG_LEVEL`.

## Useful Scripts

```bash
pnpm dev    # start in watch mode
pnpm start  # start normally
```

## License

ISC
