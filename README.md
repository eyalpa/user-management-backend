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

## Docker Compose Example
```bash
docker compose up -d
docker compose ps
```

## Environment Variables
- `PORT`: HTTP port for the API server.
- `MONGO_URI`: MongoDB connection string.

Example:
```
PORT=3000
MONGO_URI=mongodb://mongo:27017/user_management
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

### Logs Pipeline (stdout → Vector → Logstash → Elastic)
The app writes JSON logs to stdout in production. Vector (or any log collector) can read
stdout from the container/host and forward to Logstash, which parses and ships to Elastic.

Example flow:
1. **App** logs JSON to stdout.
2. **Vector** collects container logs and forwards to Logstash.
3. **Logstash** parses JSON and sends to Elastic.


## Design & Complexity Notes
- Controllers are kept thin and delegate work to services. This keeps HTTP handling separate from data logic and makes testing simpler.
- Service methods use **indexed queries** and **projections** to reduce MongoDB CPU and memory usage.
- List endpoints avoid `countDocuments` and support **cursor pagination**, which scales better than deep offset scans.
- Write operations that change state (e.g., remove user from group) run in a **transaction** to keep data consistent.
- Group `memberCount` avoids full collection scans on every update, reducing write amplification under load.

## Pagination
- Offset pagination supported via `limit/offset`.
- Cursor pagination supported via `afterId` (preferred for large datasets).


## Useful Files
- Postman collection: `postman_collection.json`

## Links
- Swagger UI: http://localhost:3000/api/v1/docs
