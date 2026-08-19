# Clinic Portal Frontend

Next.js App Router frontend for the Clinic & Medical Appointment Management System.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_BASE_URL` to the ASP.NET API origin.
3. Start the backend. Its default HTTPS launch profile uses `https://localhost:7070`.
4. Install dependencies with `npm install`.
5. Start the frontend with `npm run dev` and open `http://localhost:3000`.

## Authentication

The frontend keeps the JWT access token in memory. The backend owns the refresh token in an HttpOnly cookie. Login, registration, refresh, and logout requests include credentials so the browser can receive or send that cookie.

Protected route groups are role-specific:

- `/admin` — Admin
- `/doctor` — Doctor
- `/patient` — Patient

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```
