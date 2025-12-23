# MERN Login & Billing Dashboard

Modern MERN stack app for user auth plus a small business dashboard to manage customers, bills, expenses, and purchases.

## Project layout
- `backend/` – Express API with MongoDB (Mongoose), JWT auth, password reset email via Nodemailer.
- `frontend/` – React UI (React Router, Tailwind styles) for auth and dashboard (customers, bills, expenses, purchases).
- `older/` – Legacy prototype; not used by the main app.

## Features
- User registration and login with hashed passwords (bcrypt) and JWT sessions.
- Password reset flow (email reset link, token validation, password update).
- Protected CRUD for customers, bills (with payments), expenses, and purchases.
- Dashboard with sidebar navigation, customer pagination, bill details, and create bill/payment forms.

## Prerequisites
- Node.js 18+ and npm.
- MongoDB instance (local or Atlas).

## Backend setup (`backend/`)
1) Install deps
```powershell
cd backend
npm install
```
2) Create `.env`
```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=5000
```
3) (Optional) Configure mailer
- `controllers/userController.js` uses Gmail SMTP. Set app password and replace the hard-coded credentials or move them to env vars (`SMTP_USER`, `SMTP_PASS`).

4) Run the API
```powershell
npm run start  # or: npx nodemon server.js
```

## Frontend setup (`frontend/`)
1) Install deps
```powershell
cd frontend
npm install
```
2) Start the dev server
```powershell
npm start
```
- The app expects the API at `http://localhost:5000`. Adjust `src/services/userService.js` or use a proxy if needed.
- Default host is set to `192.168.10.5` in `package.json`; remove `--host ...` if you want `localhost`.

## Key API routes
- `POST /api/users/register` – create user
- `POST /api/users/login` – authenticate, get JWT
- `POST /api/users/forgot-password` – send reset link
- `POST /api/users/reset-password` – reset with token
- `POST /api/users/verify-token` – validate JWT
- `GET/POST/PATCH/DELETE /api/customers` – manage customers (auth required)
- `POST /api/customers/:id/bills` – add bill; `POST /api/customers/:customerId/bills/:billId/payments` – add payment
- `GET/POST/PUT/DELETE /api/expenses` – manage expenses (auth required)
- `GET/POST/PUT/PATCH/DELETE /api/purchases` – manage purchases

## Environment & security notes
- Never commit real SMTP credentials or secrets; move them to `.env` and load via `process.env`.
- JWT expiration is 1h; update in `controllers/userController.js` as needed.
- Auth middleware expects `Authorization: Bearer <token>`.

## Testing
- No automated tests are defined yet. Add unit/integration tests for critical flows (auth, reset password, customer payments) before production use.

## Future improvements
- Validate request bodies with a schema library (Joi/Zod).
- Add rate limiting and CORS origin restrictions.
- Replace hard-coded email creds with env-driven transport and branded email templates.
- Centralize API base URL for the React app via env (e.g., `.env.development`).

