# User Management Backend

Backend assignment for user/group management with MongoDB, Express, and TypeScript.

## Requirements
- Node.js 20+ (tested on Node 22)
- Docker (for MongoDB + mongo-express)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` (manually):
   ```
   PORT=3000
   MONGO_URI=mongodb://mongo:27017/user_management
   ```
3. Start services:
   ```bash
   docker compose up -d
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

## Seed Data
- CLI:
  ```bash
  npm run seed
  ```
- API:
  ```bash
  POST /api/v1/seed
  ```

## API Endpoints
Base URL: `/api/v1`

### Users
- `GET /users?limit=20&offset=0&extend=true&afterId=`
- `PATCH /users/statuses`

### Groups
- `GET /groups?limit=20&offset=0&afterId=`
- `DELETE /groups/:groupId/users/:userId`

### Swagger
- `GET /api/v1/docs`

## Logging
- Dev: colorized console logs
- Prod (`NODE_ENV=production`): JSON logs with `message`, `severity`, `timestamp`, `traceID`, plus extra metadata.

## Pagination
- Offset pagination supported via `limit/offset`.
- Cursor pagination supported via `afterId` (preferred for large datasets).

