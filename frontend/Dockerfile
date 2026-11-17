# Build context is the repository root: npm workspaces share one package-lock.json.

FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY e2e/package.json ./e2e/package.json
RUN npm ci --workspace=frontend --include-workspace-root=false

FROM deps AS dev
COPY --chown=node:node frontend ./frontend
# Vite writes its bundled config and dependency cache next to the sources.
RUN chown node:node /app/frontend
WORKDIR /app/frontend
USER node
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]

FROM deps AS build
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npx vite build

FROM nginxinc/nginx-unprivileged:1-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 8080
