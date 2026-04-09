# Game of Codes Backend

Express backend for authentication, RBAC, game progress, and live leaderboard using MongoDB Atlas.

## Features

- JWT auth with signup, login, logout.
- Role based access (`Student`, `Parent`, `Admin`).
- Age policy:
  - age `8-12`: `parentalGuidance=true`, `careerGuidance=false`
  - all others: `careerGuidance=true`
- Dynamic game catalog via database-backed `/api/games`.
- Progress tracking per user per game.
- Live leaderboard updates through Socket.IO and REST endpoint.
- Admin APIs for user list and adding new games.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string.
3. Install dependencies:
   - `npm install`
4. Start backend:
   - `npm run dev`

Backend runs on `http://localhost:5001`.

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `GET /api/features`
- `GET /api/games`
- `POST /api/games` (admin)
- `GET /api/progress/me`
- `POST /api/progress/:gameId/complete`
- `GET /api/leaderboard`
- `GET /api/admin/users` (admin)
