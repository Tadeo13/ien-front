# ─── Stage 1: Build con Vite ─────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL relativa (/api) para que la misma build funcione frente a
# cualquier backend: nginx hace el proxy en runtime (ver nginx.conf).
# Si preferís apuntar directo a una URL absoluta del backend (p. ej. en
# Northflank static site), cambiá este ARG en el build:
#   docker build --build-arg VITE_API_URL=https://TU_BACKEND.northflank.app/api
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Stage 2: Servir con Nginx (imagen mínima) ───────────────────────────────
FROM nginx:alpine

# Copia el build estático
COPY --from=builder /app/dist /usr/share/nginx/html

# Template de Nginx — se resuelve en runtime vía docker-entrypoint.d de
# nginx:alpine (envsubst) usando BACKEND_SCHEME / BACKEND_HOST / BACKEND_PORT.
# El proxy /api/* redirige a la URL del backend (que puede estar hosteado en
# otra plataforma, p. ej. Northflank o un servidor propio).
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Valores por defecto (sobrescribibles en runtime). Ejemplo con backend hosteado:
#   docker run -p 80:80 \
#     -e BACKEND_SCHEME=https -e BACKEND_HOST=ien-backend.onrender.com -e BACKEND_PORT=443 \
#     ien-front
ENV BACKEND_SCHEME=http \
    BACKEND_HOST=backend \
    BACKEND_PORT=3000

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]