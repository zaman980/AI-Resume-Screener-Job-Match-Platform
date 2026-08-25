# Signal — AI Resume Match Screener

A MERN-stack app that scores how well a resume matches a job description, the way an ATS
keyword scanner would — powered by Google's free Gemini API. Built with role-based
authentication for `jobseeker`, `recruiter`, and `admin` accounts.

- **Frontend:** React + TypeScript + Tailwind CSS (Vite)
- **Backend:** Node.js + Express + MongoDB (Mongoose) + bcrypt + JWT
- **AI:** Google Gemini 1.5 Flash (free tier)

```
resume-ai/
├── client/     React + TypeScript + Tailwind frontend
└── server/     Express + MongoDB + JWT backend
```

---

## 1. Prerequisites

- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (or local MongoDB)
- A free [Gemini API key](https://aistudio.google.com/app/apikey)
- A [GitHub](https://github.com) account and a [Vercel](https://vercel.com) account

---

## 2. Local setup

### Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/resume-ai
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_key
CLIENT_ORIGIN=http://localhost:5173
```

Run it:

```bash
npm run dev
```

The API runs at `http://localhost:5000`, health check at `GET /api/health`.

### Frontend

```bash
cd client
npm install
cp .env.example .env
```

`.env` should point at your local backend:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## 3. How authentication & authorization work

- Passwords are hashed with **bcrypt** before being saved (`User` model `pre('save')` hook).
- On login/register, the server signs a **JWT** containing the user's id and role.
- The frontend stores the token in `localStorage` and attaches it as a `Bearer` header
  on every request (see `client/src/api/axios.ts`).
- `server/middleware/authMiddleware.js` verifies the token and loads the user onto `req.user`.
- `server/middleware/roleMiddleware.js` restricts specific routes to specific roles, e.g.
  only `recruiter`/`admin` can post jobs; only `jobseeker`/`admin` can run resume analyses;
  only the recruiter who owns a job posting (or an admin) can view its ranked applicants.
- The frontend mirrors this with `ProtectedRoute`, which redirects unauthenticated users to
  `/login` and redirects users without the right role away from pages they can't use — but the
  **real** enforcement is always on the backend, since frontend checks can be bypassed.

---

## 4. Pushing to GitHub

From the `resume-ai/` root:

```bash
git init
git add .
git commit -m "Initial commit: AI resume screener MERN app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

The `.gitignore` at the root already excludes `node_modules`, `.env` files, and build output.

---

## 5. Deploying to Vercel (both frontend and backend)

Deploy **two separate Vercel projects** from the same repo — one for `client`, one for `server`.
This is the standard pattern for a MERN app on Vercel since the frontend and backend are
independently built and scaled.

### 5a. Deploy the backend

1. On [vercel.com](https://vercel.com), click **Add New → Project**, import your GitHub repo.
2. When configuring the project, set **Root Directory** to `server`.
3. Framework preset: **Other**.
4. Add environment variables (same as your local `.env`, minus `PORT`):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `GEMINI_API_KEY`
   - `CLIENT_ORIGIN` — set this to your frontend's Vercel URL once you have it (you can update
     it after step 5b and redeploy)
5. Deploy. Your API will be live at `https://<your-backend-project>.vercel.app`.
6. Confirm it works: visit `https://<your-backend-project>.vercel.app/api/health`.

> The backend already includes `server/api/index.js` and `server/vercel.json`, which route all
> requests through a single serverless function wrapping the Express app — no extra config needed.

### 5b. Deploy the frontend

1. **Add New → Project** again, same repo, but set **Root Directory** to `client`.
2. Framework preset: **Vite** (auto-detected).
3. Add environment variable:
   - `VITE_API_URL` = `https://<your-backend-project>.vercel.app/api`
4. Deploy. Your app will be live at `https://<your-frontend-project>.vercel.app`.

### 5c. Close the loop

Go back to the backend project's environment variables on Vercel and set `CLIENT_ORIGIN` to your
live frontend URL (e.g. `https://<your-frontend-project>.vercel.app`), then redeploy the backend
so CORS allows requests from your live site.

---

## 6. MongoDB Atlas network access

Vercel serverless functions use dynamic IPs, so in your Atlas cluster's **Network Access**
settings, allow access from `0.0.0.0/0` (anywhere) — Atlas's connection string auth (username/
password) is still what protects the database.

---

## 7. Free-tier notes

- **Gemini 1.5 Flash** free tier has request-per-minute limits; the backend includes a rate
  limiter (`server/middleware/rateLimiter.js`) on the analysis endpoint to stay within them and
  prevent abuse. If you hit limits during testing, wait a minute and retry.
- **MongoDB Atlas free tier (M0)** is sufficient for development and light production use.
- **Vercel's free (Hobby) tier** is sufficient for both projects here.

---

## 8. Project structure reference

```
server/
├── api/index.js          # Vercel serverless entry point
├── app.js                # Express app (routes, middleware, CORS)
├── server.js             # Local dev entry point
├── config/db.js          # MongoDB connection
├── models/                # User, JobPosting, ResumeAnalysis
├── middleware/            # auth, role, rate-limit
├── controllers/           # auth, job, analysis logic
├── routes/                 # auth, job, analysis endpoints
└── services/geminiService.js  # Gemini AI integration

client/
├── src/
│   ├── pages/              # Landing, Login, Register, Dashboard, Jobs, PostJob, UploadResume, JobApplicants
│   ├── components/         # Navbar, ProtectedRoute, ScoreGauge, Spinner
│   ├── context/AuthContext.tsx
│   ├── api/axios.ts
│   └── types/index.ts
```
