# ---- builder ----
FROM node:20-bullseye-slim AS builder

# Create app directory
WORKDIR /usr/src/app

# Install basic build tools (kept small). If you prefer alpine, swap image but be aware of musl issues.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package.json package-lock.json* npm-shrinkwrap.json* ./

# Install all deps (including devDependencies) for building
RUN npm ci --prefer-offline --no-audit --progress=false

# Copy the rest of the source
COPY . .

# Build step
# This runs: "react-router typegen && react-router build" as defined in your package.json
RUN npm run build

# ---- runtime ----
FROM node:20-bullseye-slim AS runtime

# Create a non-root user
RUN useradd --user-group --create-home --shell /bin/false appuser

WORKDIR /usr/src/app

# Copy only what we need from builder:
#  - production node_modules
#  - built assets (assumes build output is in ./build or similar)
#  - server entry (server.mjs)
#  - any static/public files required at runtime
#
# Adjust paths below if your build outputs to a different folder.
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/server.mjs ./server.mjs
COPY --from=builder /usr/src/app/.env* ./

# If you have public/ or assets/ directories required at runtime:
# COPY --from=builder /usr/src/app/public ./public

# If your app needs environment variables or runtime config, set default here:
ENV NODE_ENV=production
ENV PORT=3000

# Make sure files are readable
RUN chown -R appuser:appuser /usr/src/app

USER appuser

EXPOSE 3000

# Healthcheck (adjust if your app exposes a different path)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD [ "sh", "-c", "nc -z localhost ${PORT} || exit 1" ]

# Entrypoint: use the same start command (you can also use `npm start` but we prefer direct node)
CMD [ "node", "./server.mjs" ]
