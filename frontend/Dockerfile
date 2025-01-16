# syntax=docker/dockerfile:1.10.0

# Definiere ARG für die Umgebungsvariablen
# ARG NODE_VERSION=23
ARG NODE_VERSION=22.9.0

# ---------------------------------------------------------------------------------------
# S t a g e   d i s t
# ---------------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS dist

ARG NODE_TLS_REJECT_UNAUTHORIZED
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET
ARG NEXT_PUBLIC_KEYCLOAK_ISSUER
ARG NEXT_PUBLIC_BACKEND_SERVER_URL
ARG NEXT_PUBLIC_LOG_LEVEL
ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_PINO_PRETTY
ARG NEXT_PUBLIC_LOG_DIR
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# Umgebungsvariablen festlegen
ENV NODE_TLS_REJECT_UNAUTHORIZED=${NODE_TLS_REJECT_UNAUTHORIZED} \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${NEXT_PUBLIC_KEYCLOAK_CLIENT_ID} \
    NEXT_PUBLIC_KEYCLOAK_ISSUER=${NEXT_PUBLIC_KEYCLOAK_ISSUER} \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=${NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET} \
    NEXT_PUBLIC_BACKEND_SERVER_URL=${NEXT_PUBLIC_BACKEND_SERVER_URL} \
    NEXT_PUBLIC_LOG_LEVEL=${NEXT_PUBLIC_LOG_LEVEL} \
    NEXT_PUBLIC_NODE_ENV=${NEXT_PUBLIC_NODE_ENV} \
    NEXT_PUBLIC_PINO_PRETTY=${NEXT_PUBLIC_PINO_PRETTY} \
    NEXT_PUBLIC_LOG_DIR=${NEXT_PUBLIC_LOG_DIR} \
    NEXTAUTH_DEBUG=true \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET}


RUN <<EOF
set -eux
apt-get update
apt-get upgrade --yes

# Installiere curl im Container
apt-get install --no-install-recommends --yes curl

npm i -g --no-audit --no-fund npm
EOF

USER node

WORKDIR /home/node

COPY public ./public
COPY src ./src

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=cache,target=/root/.npm <<EOF
set -eux
npm ci --no-audit --no-fund
npm run build
EOF

# ------------------------------------------------------------------------------
# S t a g e   d e p e n d e n c i e s
# ------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS dependencies

RUN <<EOF
set -eux
apt-get update
apt-get upgrade --yes

npm i -g --no-audit --no-fund npm
EOF

USER node

WORKDIR /home/node

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm <<EOF
set -eux
npm ci --no-audit --no-fund --omit=peer
EOF

# ------------------------------------------------------------------------------
# S t a g e   f i n a l
# ------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS final

ARG NODE_TLS_REJECT_UNAUTHORIZED
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET
ARG NEXT_PUBLIC_KEYCLOAK_ISSUER
ARG NEXT_PUBLIC_BACKEND_SERVER_URL
ARG NEXT_PUBLIC_LOG_LEVEL
ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_PINO_PRETTY
ARG NEXT_PUBLIC_LOG_DIR
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# Umgebungsvariablen festlegen
ENV NODE_TLS_REJECT_UNAUTHORIZED=${NODE_TLS_REJECT_UNAUTHORIZED} \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${NEXT_PUBLIC_KEYCLOAK_CLIENT_ID} \
    NEXT_PUBLIC_KEYCLOAK_ISSUER=${NEXT_PUBLIC_KEYCLOAK_ISSUER} \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=${NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET} \
    NEXT_PUBLIC_BACKEND_SERVER_URL=${NEXT_PUBLIC_BACKEND_SERVER_URL} \
    NEXT_PUBLIC_LOG_LEVEL=${NEXT_PUBLIC_LOG_LEVEL} \
    NEXT_PUBLIC_NODE_ENV=${NEXT_PUBLIC_NODE_ENV} \
    NEXT_PUBLIC_PINO_PRETTY=${NEXT_PUBLIC_PINO_PRETTY} \
    NEXT_PUBLIC_LOG_DIR=${NEXT_PUBLIC_LOG_DIR} \
    NEXTAUTH_DEBUG=true \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Debugging der Umgebungsvariablen
# RUN echo "NODE_TLS_REJECT_UNAUTHORIZED=${NODE_TLS_REJECT_UNAUTHORIZED}" \
#     && echo "NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}" \
#     && echo "NEXT_PUBLIC_KEYCLOAK_ISSUER=${NEXT_PUBLIC_KEYCLOAK_ISSUER}" \
#     && echo "NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=${NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET}" \
#     && echo "NEXT_PUBLIC_BACKEND_SERVER_URL=${NEXT_PUBLIC_BACKEND_SERVER_URL}" \
#     && echo "NEXT_PUBLIC_LOG_LEVEL=${NEXT_PUBLIC_LOG_LEVEL}" \
#     && echo "NEXT_PUBLIC_NODE_ENV=${NEXT_PUBLIC_NODE_ENV}" \
#     && echo "NEXT_PUBLIC_PINO_PRETTY=${NEXT_PUBLIC_PINO_PRETTY}" \
#     && echo "NEXT_PUBLIC_LOG_DIR=${NEXT_PUBLIC_LOG_DIR}" \
#     && echo "NEXTAUTH_URL=${NEXTAUTH_URL}" \
#     && echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}"

# Anzeige bei "docker inspect ..."
LABEL org.opencontainers.image.title="frontend" \
    org.opencontainers.image.description="Frontend für das dynamische Rollen- und Funktionsmanagement" \
    org.opencontainers.image.version="2024.12.1" \
    org.opencontainers.image.licenses="GPL-3.0-or-later" \
    org.opencontainers.image.authors="Flowcraft AG"

RUN <<EOF
set -eux
apt-get update

# Installiere dumb-init
apt-get install --no-install-recommends --yes dumb-init=1.2.5-2

# Bereinige temporäre Dateien und Caches
apt-get autoremove --yes
apt-get clean --yes
rm -rf /var/lib/apt/lists/*
rm -rf /tmp/*
EOF

WORKDIR /opt/app

USER node

COPY --chown=node:node package.json .env ./
COPY --from=dependencies --chown=node:node /home/node/node_modules ./node_modules
COPY --from=dist --chown=node:node /home/node/public ./public
COPY --from=dist --chown=node:node /home/node/.next ./.next

EXPOSE 4000

# Setze EntryPoint für den Container
ENTRYPOINT ["dumb-init", "npm", "start"]
