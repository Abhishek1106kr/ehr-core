FROM node:24-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --workspace=apps/web --workspace=packages/shared --include-workspace-root

FROM base AS build
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build --workspace=packages/shared && npm run build --workspace=apps/web

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /repo/apps/web/public ./apps/web/public
COPY --from=build /repo/apps/web/.next ./apps/web/.next
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/web/package.json ./apps/web/package.json
WORKDIR /repo/apps/web
EXPOSE 3000
CMD ["npm", "run", "start"]
