# syntax=docker/dockerfile:1
# Build from the repository root:
#   docker build -f apps/app-ux-flows/Dockerfile -t app-ux-flows .

FROM node:22.19.0-bookworm-slim AS build
WORKDIR /repo
RUN npm install -g pnpm@12.14.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
RUN pnpm fetch

COPY apps/app-ux-flows apps/app-ux-flows
RUN pnpm install --offline --frozen-lockfile --filter app-ux-flows
RUN pnpm --filter app-ux-flows build

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY apps/app-ux-flows/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=755 apps/app-ux-flows/docker/40-ux-flows-config.sh /docker-entrypoint.d/40-ux-flows-config.sh
COPY --from=build /repo/apps/app-ux-flows/dist /usr/share/nginx/html
COPY --from=build --chown=101:101 /repo/apps/app-ux-flows/dist/config.js /usr/share/nginx/html/config.js

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
