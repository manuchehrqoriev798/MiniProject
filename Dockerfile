# Single Dockerfile: build React, then run FastAPI (serves API + frontend)
FROM node:20-bookworm-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --prefer-offline --no-audit
COPY frontend/ ./
ENV REACT_APP_API_URL=/api
ENV REACT_APP_API_BASE_URL=
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
# Install backend deps
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
# Copy built frontend into backend/static
COPY --from=frontend /app/frontend/build ./static
EXPOSE 8000
ENV PORT=8000
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
