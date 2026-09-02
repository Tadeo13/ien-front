# IEN — Frontend

Frontend de la plataforma IEN (Inteligencia Emocional): panel de administración y programa de 30 días.

> ⚠️ **Este repositorio es solo el frontend.** El backend (API Express/MongoDB, seed y cron jobs) vive en un repositorio separado: [`alex43x/ien-back`](https://github.com/alex43x/ien-back).

## Estructura

```
├── frontend/            # Aplicación React + Vite + TypeScript (ver frontend/README.md)
└── frontend/…
```

## Desarrollo local

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:3000/api (backend local)
npm run dev
```

En `frontend/README.md` están todos los scripts, el stack y los detalles de entorno.

## Despliegue

### Opción A — Northflank (static site)

| Campo | Valor |
|-------|-------|
| Service Type | Static |
| Build Path | `/frontend` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| `VITE_API_URL` (build) | `https://<BACKEND>.northflank.app/api` |

### Opción B — Contenedor Docker/Nginx

El `frontend/Dockerfile` compila la app y la sirve con Nginx. El navegador consume `VITE_API_URL=/api` (relativa) y Nginx proxyfía `/*api*` al backend configurado en runtime:

```bash
docker build -t ien-front ./frontend
docker run -p 80:80 \
  -e BACKEND_SCHEME=https \
  -e BACKEND_HOST=<BACKEND>.northflank.app \
  -e BACKEND_PORT=443 \
  ien-front
```

- `BACKEND_SCHEME` / `BACKEND_HOST` / `BACKEND_PORT` → hacia dónde Nginx manda las llamadas `/api/*`.
- También podés compilar con un `VITE_API_URL` absoluto (`--build-arg VITE_API_URL=https://<BACKEND>/api`) si no querés el proxy.

## Referencias

- Backend + API: [`alex43x/ien-back`](https://github.com/alex43x/ien-back)
- Backend en Northflank: seeder (`npm run seed`) y cron jobs (`/api/jobs/*`) se administran desde el repo del backend.