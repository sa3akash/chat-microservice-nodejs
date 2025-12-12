# ---------------- BASE IMAGE ----------------
FROM node:22-alpine AS base

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

WORKDIR /app

# ---------------- DEPENDENCIES & BUILD ----------------
FROM base AS builder

# Copy root manifests and workspace packages manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./

COPY packages/common/package.json ./packages/common/
COPY services/gateway-service/package.json ./services/gateway-service/

# Copy source code
COPY packages/common ./packages/common
COPY services/gateway-service ./services/gateway-service

# Install all dependencies (including dev for build)
RUN pnpm install --frozen-lockfile
# Build only needed packages

RUN pnpm --filter @chat/common build
RUN pnpm --filter gateway-service build

# ---------------- PRODUCTION ----------------
FROM node:22-alpine AS production

WORKDIR /app

# Copy root manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace manifests
COPY packages/common/package.json ./packages/common/
COPY services/gateway-service/package.json ./services/gateway-service/

# Install only production deps
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate \
&& pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/services/gateway-service/dist ./services/gateway-service/dist

# Switch to non-root user
USER node

WORKDIR /app/services/gateway-service

ENV NODE_ENV=production \
    GATEWAY_SERVICE_PORT=4000

EXPOSE 4000

CMD ["node", "dist/index.js"]
