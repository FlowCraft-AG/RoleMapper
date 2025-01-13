# Backend README

## 📖 Inhaltsverzeichnis

1. [Einleitung](#einleitung)
2. [Funktionen](#funktionen)
3. [Technologie-Stack](#technologie-stack)
4. [Projektstruktur](#projektstruktur)
5. [Setup](#setup)
6. [Nutzung](#nutzung)
7. [Entwicklung](#entwicklung)
8. [Dokumentation](#dokumentation)

---

## Einleitung
Das Backend des **RoleMapper**-Projekts basiert auf **NestJS** und **TypeScript** und verwendet **MongoDB** als Datenbank. Es bietet eine robuste API zur Unterstützung von Rollen- und Berechtigungsmanagement sowie eine Integration mit **Keycloak** zur Authentifizierung. Zusätzlich unterstützt es die Verwaltung und Ausführung von Workflows über die Integration mit **Camunda**.

---

## Funktionen
- **Rollen-Mapping**: Dynamische Zuordnung von Rollen basierend auf Funktionen.
- **Authentifizierung**: Sichere Anmeldung mit Keycloak.
- **GraphQL-API**: Flexible Datenabfragen und Mutationen.
- **Erweiterbar**: Modularer Aufbau für einfache Erweiterungen.
- **Camunda-Integration**: Möglichkeit, Camunda-Prozesse zu starten und deren Aufgaben und Variablen zu verwalten. Schnittstellen zu Operate, Tasklist, Identity und anderen Camunda-Services sind verfügbar.

---

## Technologie-Stack
- **Framework**: NestJS
- **Programmiersprache**: TypeScript
- **Datenbank**: MongoDB
- **Authentifizierung**: Keycloak
- **API-Kommunikation**: GraphQL
- **Workflow-Engine**: Camunda 8

---

## Projektstruktur
```plaintext
backend
├── __tests__          # Tests für das Backend
│   └── role-mapper    # Snapshot-Tests für Role-Mapping
│       └── __snapshots__
├── log               # Log-Dateien des Backends
└── src               # Quellcode des Backends
    ├── camunda       # Camunda-spezifische Logik
    │   ├── controller # API-Endpunkte für Camunda
    │   ├── resolver   # GraphQL-Resolver für Camunda
    │   └── service    # Services für Camunda-Integration
    ├── config        # Konfigurationsdateien
    │   └── resources # Ressourcen wie GraphQL-Schema und app.yml
    │       └── graphql
    ├── logger        # Logging-Funktionalität
    ├── role-mapper   # Hauptlogik für das Rollen-Mapping
    │   ├── controller  # API-Endpunkte
    │   ├── error       # Fehlerbehandlung
    │   ├── model       # Datenmodelle
    │   │   ├── dto       # Data Transfer Objects
    │   │   ├── entity    # Datenbank-Entitäten
    │   │   ├── enum      # Enumerationen
    │   │   ├── input     # GraphQL-Inputs
    │   │   ├── payload   # Antwort-Payloads
    │   │   └── types     # Allgemeine Typdefinitionen
    │   ├── resolver    # GraphQL-Resolver
    │   ├── service     # Geschäftliche Logik
    │   └── utils       # Hilfsfunktionen
    └── security       # Sicherheitsrelevanter Code
        ├── http        # HTTP-Sicherheitskonfiguration
        └── keycloak    # Keycloak-Integration
```

---

## Setup

### Voraussetzungen
- **Node.js**: Version 22.x oder höher
- **npm**: Version 8.x oder höher
- **MongoDB**: Zugriff auf eine MongoDB-Instanz

### Schritte

1. **Repository klonen:**
   ```bash
   git clone https://github.com/FlowCraft-AG/RoleMapper.git
   cd RoleMapper/backend
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren:**
   - Erstelle eine Datei `.env` im Verzeichnis `backend` mit folgendem Inhalt:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>
     MONGODB_DATABASE=<database>
     KEYCLOAK_CLIENT_SECRET=<keycloak-client-secret>
     ```

4. **TLS-Schlüssel und -Zertifikate erstellen:**
   ```bash
   mkdir -p .volumes/keys
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout .volumes/keys/key.pem -out .volumes/keys/certificate.crt
   openssl pkcs12 -export -in .volumes/keys/certificate.crt -inkey .volumes/keys/key.pem -out .volumes/keys/keycloak.p12 -name keycloak -passout pass:changeit
   ```

5. **Camunda-Integration aktivieren (optional):**
   - In der Datei `backend/src/config/resources/app.yml` den Wert `zeebe:enable` wie folgt setzen:
     ```yaml
     zeebe:
       url: localhost:26500
       enable: true
     ```
   - Sicherstellen, dass entweder der **Core**- oder der **Full**-Camunda-Container (siehe Camunda-Setup unten) läuft.
   - Wenn keine Camunda-Integration gewünscht ist, den Wert auf `false` lassen.

---

## Nutzung

### Entwicklungsmodus
Starte den Server im Entwicklungsmodus:
```bash
npm run start:dev
```
Die API ist unter `http://localhost:3000` erreichbar.

### Produktionsmodus
Baue das Projekt und starte es im Produktionsmodus:
```bash
npm run build
npm run start
```

### Docker-Setup
Starte das Backend mit Docker:
```bash
cd .extras/compose/backend
docker compose up -d
```

### Camunda-Setup

#### Core-Version
Dies ist eine leichte Konfiguration, die Zeebe, Operate, Tasklist und Elasticsearch enthält.

1. Navigiere in das Verzeichnis:
   ```bash
   cd .extras/compose/camunda
   ```

2. Starte die Core-Version:
   ```bash
   docker compose -f docker-compose-core.yml up -d
   ```

#### Full-Version
Diese vollständige Konfiguration umfasst Zeebe, Operate, Tasklist, Optimize, Identity, Keycloak und Elasticsearch.

1. Navigiere in das Verzeichnis:
   ```bash
   cd .extras/compose/camunda/full
   ```

2. Starte die Full-Version:
   ```bash
   docker compose up -d
   ```

---

## Entwicklung

- **Normale Tests ausführen:**
  ```bash
  npm test
  ```

- **Coverage-Tests:**
  ```bash
  npm run test:istanbul
  ```

---

## Dokumentation

Die detaillierte Dokumentation des Projekts findest du unter:
[GitHub Pages](https://FlowCraft-AG.github.io/RoleMapper/)

