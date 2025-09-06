########################
# 1️⃣ Build stage
########################
FROM node:18-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app

# copy manifests first for caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY services/order-service/package.json ./services/order-service/
COPY common/mongoose-client/package.json ./common/mongoose-client/

# install
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# copy the rest
COPY . .

# build service + its workspace deps
RUN pnpm -r --filter ./services/order-service... --filter ./services/order-service...^... build

# ✅ allow deploy with injected workspace packages (pnpm v10)
ENV PNPM_CONFIG_INJECT_WORKSPACE_PACKAGES=true

# create isolated output (no symlinks)
RUN pnpm --filter ./services/order-service... deploy --prod --legacy /out

########################
# 2️⃣ Runtime stage
########################
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /out ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/app.js"]
