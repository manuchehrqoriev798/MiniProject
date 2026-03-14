# Fix CORS: "No 'Access-Control-Allow-Origin' header" (Vercel + Fly.io)

Your frontend is on **Vercel** (`https://frontend-yq73.vercel.app`) and your backend is on **Fly.io** (`https://backend-solitary-field-5704.fly.dev`). The backend must explicitly allow the frontend origin.

---

## 1. Set CORS on the backend (Fly.io)

On **Fly.io**, set the env var **`CORS_ORIGINS`** to your frontend URL.

**Option A – Fly.io dashboard**

1. Open [Fly.io Dashboard](https://fly.io/dashboard) → your app **backend-solitary-field-5704** (or the app that serves the API).
2. Go to **Settings** → **Secrets and environment variables** (or **Environment variables**).
3. Add or edit:
   - **Name:** `CORS_ORIGINS`
   - **Value:** `https://frontend-yq73.vercel.app`
4. Save and **redeploy** the app (e.g. trigger a new deploy or run `fly deploy`).

**Option B – Fly CLI**

```bash
fly secrets set CORS_ORIGINS="https://frontend-yq73.vercel.app" -a backend-solitary-field-5704
```

Then redeploy:

```bash
fly deploy -a backend-solitary-field-5704
```

(Use your actual Fly app name if it’s different.)

---

## 2. Use the correct API base URL on the frontend (Vercel)

Your backend routes are under **`/api`** (e.g. `/api/auth/login`). The request in the error was to `/auth/login` (no `/api`), so the frontend base URL is likely wrong.

On **Vercel** (frontend project):

1. **Project** → **Settings** → **Environment Variables**.
2. Set **`REACT_APP_API_URL`** to:
   ```text
   https://backend-solitary-field-5704.fly.dev/api
   ```
   (with **`/api`** at the end).
3. **Redeploy** the frontend (e.g. trigger a new deployment from the Vercel dashboard or push a commit).

---

## Summary

| Where   | Variable            | Value |
|--------|----------------------|--------|
| **Fly.io** (backend)  | `CORS_ORIGINS`       | `https://frontend-yq73.vercel.app` |
| **Vercel** (frontend) | `REACT_APP_API_URL`  | `https://backend-solitary-field-5704.fly.dev/api` |

After setting both and redeploying backend and frontend, the CORS error should go away and login should hit `/api/auth/login` correctly.
