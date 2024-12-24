# syntax=docker/dockerfile:1.10.0

# Definiere ARG für die Umgebungsvariablen
ARG NODE_VERSION=23
ARG NODE_TLS_REJECT_UNAUTHORIZED
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET
ARG KEYCLOAK_ISSUER
ARG NEXT_PUBLIC_BACKEND_SERVER_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_LOG_LEVEL
ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_PINO_PRETTY
ARG NEXT_PUBLIC_LOG_DIR

# ---------------------------------------------------------------------------------------
# S t a g e   d i s t
# ---------------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS dist

RUN <<EOF
set -eux
apt-get update
apt-get upgrade --yes

# Installiere Python und Abhängigkeiten
apt-get install --no-install-recommends --yes python3.11=3.11.2-6+deb12u4 python3.11-dev=3.11.2-6+deb12u4 python3.11-minimal=3.11.2-6+deb12u4
ln -s /usr/bin/python3.11 /usr/bin/python3
ln -s /usr/bin/python3.11 /usr/bin/python

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
# ci (= clean install) mit package-lock.json  dependencies installieren
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

# Installiere Python und Abhängigkeiten
apt-get install --no-install-recommends --yes python3.11=3.11.2-6+deb12u4 python3.11-dev=3.11.2-6+deb12u4 python3.11-minimal=3.11.2-6+deb12u4
ln -s /usr/bin/python3.11 /usr/bin/python3
ln -s /usr/bin/python3.11 /usr/bin/python

npm i -g --no-audit --no-fund npm
EOF

USER node

WORKDIR /home/node

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm <<EOF
set -eux
# ci (= clean install) mit package-lock.json
# --omit=dev: ohne devDependencies
npm ci --no-audit --no-fund --omit=peer
EOF

# ------------------------------------------------------------------------------
# S t a g e   f i n a l
# ------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS final

ENV NODE_TLS_REJECT_UNAUTHORIZED=${NODE_TLS_REJECT_UNAUTHORIZED} \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}\
    NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=${NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET} \
    KEYCLOAK_ISSUER=${KEYCLOAK_ISSUER} \
    NEXT_PUBLIC_BACKEND_SERVER_URL=${NEXT_PUBLIC_BACKEND_SERVER_URL} \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXT_PUBLIC_LOG_LEVEL=${NEXT_PUBLIC_LOG_LEVEL} \
    NEXT_PUBLIC_NODE_ENV=${NEXT_PUBLIC_NODE_ENV} \
    NEXT_PUBLIC_PINO_PRETTY=${NEXT_PUBLIC_PINO_PRETTY} \
    NEXT_PUBLIC_LOG_DIR=${NEXT_PUBLIC_LOG_DIR}

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
