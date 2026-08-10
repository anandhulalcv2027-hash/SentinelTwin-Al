# SentinelTwin AI — Frontend

> React + TypeScript + Vite frontend for the SentinelTwin AI endpoint security platform.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| npm | ≥ 10 |
| FastAPI backend | running on `http://localhost:8000` |

---

## Setup

### 1. Clone the repo and enter the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different port:

```
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Start the development server

```bash
npm run dev
```

The app is served at **http://localhost:5173**.

All `/api/*` requests are proxied to `VITE_API_BASE_URL` by Vite so you don't need to configure CORS during development.

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production TypeScript build + bundle |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── assets/           Static assets
├── components/
│   ├── three/        React Three Fiber scene components
│   └── ProtectedRoute.tsx
├── layouts/
│   ├── PublicLayout.tsx   Landing / auth pages shell
│   └── AppLayout.tsx      Authenticated app shell
├── lib/
│   ├── api.ts         Axios client with auth interceptor
│   ├── AuthContext.tsx React auth context + provider
│   └── tokenStore.ts  localStorage token helpers
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── AppHomePage.tsx
├── services/
│   └── authService.ts
├── types/
│   └── auth.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## API Integration

| Endpoint | Method | Body |
|----------|--------|------|
| `/api/v1/auth/register` | POST | JSON |
| `/api/v1/auth/login` | POST | `application/x-www-form-urlencoded` |
| `/api/v1/auth/me` | GET | Bearer token |

Token is stored in `localStorage` as `st_access_token` and auto-attached by the Axios interceptor.
