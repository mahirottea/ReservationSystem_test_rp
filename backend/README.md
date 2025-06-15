# Reservation System Backend

This directory contains the NestJS API that powers the reservation system. The service provides endpoints for authentication, tenant management, and reservations.

## Description
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup
```bash
$ npm install
cp .env.example .env # 環境変数ファイルをコピー
```

## Required environment variables
Create a `.env` file in `backend/` with the following keys:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/reservationsystem_db
SHADOW_DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/shadow_db
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://localhost:3000
PORT=4000
SETUP_EMAIL=admin@example.com
SETUP_PASSWORD=changeme
```

## Development
Install dependencies and start the development server:

```bash
npm install
npm run start:dev
```

Run Prisma migrations:

```bash
npx prisma migrate dev
export SETUP_EMAIL=admin@example.com
export SETUP_PASSWORD=changeme
npm run seed
```

Execute unit and e2e tests:

```bash
npm test        # unit tests
npm run test:e2e
```

## Main entry points
- `src/main.ts` – application bootstrap
- `src/controllers/` – HTTP controllers
- `src/modules/` – feature modules

## Scheduled tasks
The backend uses `@nestjs/schedule` to run periodic jobs. A daily cron job
removes expired records from the `rememberToken` table. This cleanup
task is implemented in `TokenCleanupService` and runs every midnight.

