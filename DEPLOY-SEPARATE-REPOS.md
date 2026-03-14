# Deploy with separate repos (Backend, Frontend, Workflow)

You have **backend**, **frontend**, and **workflow** as separate GitHub repos. Use the config **inside each repo**, not the root `render.yaml` in this folder.

---

## Where each file lives

| Repo      | What to put in that repo’s root |
|-----------|----------------------------------|
| **Backend**  | `render.yaml` + `Dockerfile` (copy from this project’s `backend/` folder) |
| **Frontend** | `render.yaml` (copy from this project’s `frontend/` folder) |
| **Workflow** | No Render deploy needed for the exam platform; deploy only backend + frontend. |

---

## Step 1: Deploy the backend

1. In your **backend repo** (root = backend code: `app/`, `requirements.txt`, `alembic/`, etc.):
   - Copy **`backend/render.yaml`** and **`backend/Dockerfile`** and **`backend/.dockerignore`** from this project into the **root** of the backend repo.
2. In Render: **New → Blueprint** → connect the **backend** GitHub repo.
3. Render will use that repo’s `render.yaml` and create the API + Postgres.
4. After deploy, copy the backend URL (e.g. `https://exam-platform-api.onrender.com`).

---

## Step 2: Deploy the frontend

1. In your **frontend repo** (root = frontend code: `src/`, `package.json`, etc.):
   - Copy **`frontend/render.yaml`** from this project into the **root** of the frontend repo.
2. In Render: **New → Blueprint** → connect the **frontend** GitHub repo.
3. In the frontend service → **Environment**, set:
   - **REACT_APP_API_URL** = `<backend-url>/api`  
     Example: `https://exam-platform-api.onrender.com/api`
4. Redeploy the frontend so the build uses the new env var.

---

## Step 3: CORS (backend)

In the **backend** service on Render → **Environment**, set **CORS_ORIGINS** to your frontend URL, e.g.:

- `https://exam-platform-frontend.onrender.com`

(Use the exact URL Render gives your frontend service.)

---

## Summary

- **Backend repo root**: `render.yaml`, `Dockerfile`, `.dockerignore` (from this repo’s `backend/`).
- **Frontend repo root**: `render.yaml` (from this repo’s `frontend/`).
- **Root `render.yaml`** in this MiniProject folder is only a reminder; do **not** use it as a Blueprint. Use the YAML inside each repo.
