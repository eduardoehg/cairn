# syntax=docker/dockerfile:1
# Build portável da API (@cairn/api) a partir do monorepo.
# Funciona em qualquer plataforma de container (Render, Cloud Run, Koyeb...).

# ---------- base: pnpm sobre node ----------
FROM node:24-slim AS base
RUN npm install -g pnpm@11.7.0
WORKDIR /app

# ---------- pruner: isola o subgrafo do @cairn/api ----------
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.9.18 prune @cairn/api --docker

# ---------- builder: instala, builda types→api, gera bundle de prod ----------
FROM base AS builder
# 1) deps — camada cacheável a partir dos manifests + lockfile podados
COPY --from=pruner /app/out/json/ ./
RUN pnpm install --frozen-lockfile
# 2) código podado + build (types antes da api)
COPY --from=pruner /app/out/full/ ./
# turbo prune não leva o tsconfig base da raiz (referenciado via "extends")
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json
RUN pnpm --filter @cairn/types build && pnpm --filter @cairn/api build
# 3) node_modules de produção, sem symlinks, pronto pra copiar
RUN pnpm --filter @cairn/api deploy --prod --legacy /app/prod

# ---------- runner: imagem final enxuta ----------
FROM node:24-slim AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/prod/node_modules ./node_modules
COPY --from=builder /app/prod/dist ./dist
# A porta vem de PORT (Render/Cloud Run injetam). Migrations rodam no boot
# quando RUN_MIGRATIONS=true (ver TypeOrmModule).
CMD ["node", "dist/main.js"]
