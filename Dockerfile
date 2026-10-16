# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG AUTH_URL=https://nrlearn.adelweb.com.br
ENV AUTH_URL=$AUTH_URL
ENV AUTH_SECRET=build-time-placeholder-secret-not-used-at-runtime
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM base AS migrator
RUN apk add --no-cache postgresql-client
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json drizzle.config.ts ./
COPY src/db ./src/db
COPY scripts/docker-migrate.sh scripts/docker-migrate.mjs ./scripts/
RUN sed -i 's/\r$//' ./scripts/docker-migrate.sh \
  && chmod +x ./scripts/docker-migrate.sh
CMD ["./scripts/docker-migrate.sh"]

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/uploads/lessons && chown -R nextjs:nodejs /app/uploads

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
