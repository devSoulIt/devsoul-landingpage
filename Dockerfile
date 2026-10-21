# Imagen de producción para la VPS. La compila GitHub Actions y la sube a GHCR;
# la VPS solo la baja (ver devSoulIt/vps-infra).
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build && npm prune --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 3000
# El puerto lo pone la variable PORT del compose.
CMD ["sh", "-c", "exec npx next start -p ${PORT:-3000} -H 0.0.0.0"]
