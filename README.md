# Deviro Test Task

This is a monorepo with:

- `apps/client` - React + Vite frontend
- `apps/server` - Node.js + Express + WebSocket backend
- `packages/*` - shared packages used by apps

## Tech stack

- TypeScript
- React
- React-Leaflet
- MobX
- MUI
- Node.js
- WebSocket

## Features

- Auth via password + token
- 100-200 moving objects
- Smart city targeting
- Danger zones
- Lost + recovery logic
- Real-time updates

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## 1. Clone the repository

```bash
git clone https://github.com/Saharij/deviro-test-task.git
cd deviro-test-task
```

## 2. Install dependencies

From the repo root:

```bash
npm install
```

## 3. Start the project locally

From the repo root:

```bash
npm run dev
```

This starts both apps in parallel:

- Client: `http://localhost:5173`
- Server: `http://localhost:3001`

## 4. Login and use the app

1. Open `http://localhost:5173`
2. Login with password:

```text
secret1111
```

After login, the client receives a token and connects to server WebSocket updates.

## Useful scripts

From the root:

```bash
npm run dev
```

From individual workspaces:

```bash
npm run dev -w client
npm run dev -w server
```

## Troubleshooting

- If ports are busy, stop other processes using `3001` or `5173`.
- If dependencies are broken, remove `node_modules` and reinstall:

```bash
rm -rf node_modules
npm install
```
