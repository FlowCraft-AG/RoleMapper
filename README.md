# **RoleMapper** by FlowCraft AG

![Auto Assign](https://github.com/FlowCraft-AG/demo-repository/actions/workflows/auto-assign.yml/badge.svg)
![Proof HTML](https://github.com/FlowCraft-AG/RoleMapper/actions/workflows/proof-html.yml/badge.svg)

![Backend Test](https://github.com/FlowCraft-AG/RoleMapper/actions/workflows/test-backend.yml/badge.svg)
![security-backend](https://github.com/FlowCraft-AG/demo-repository/actions/workflows/security-backend.yml/badge.svg)

![Build Status](https://img.shields.io/github/actions/workflow/status/FlowCraft-AG/RoleMapper/ci-cd-backend.yml)
![Coverage](https://img.shields.io/codecov/c/github/FlowCraft-AG/RoleMapper)
![Dependencies](https://img.shields.io/librariesio/github/FlowCraft-AG/RoleMapper)

![Last Commit](https://img.shields.io/github/last-commit/FlowCraft-AG/RoleMapper)
![Issues](https://img.shields.io/github/issues/FlowCraft-AG/RoleMapper)
![Pull Requests](https://img.shields.io/github/issues-pr/FlowCraft-AG/RoleMapper)
![Activity](https://img.shields.io/github/commit-activity/m/FlowCraft-AG/RoleMapper)
![Code Size](https://img.shields.io/github/languages/code-size/FlowCraft-AG/RoleMapper)
![Primary Language](https://img.shields.io/github/languages/top/FlowCraft-AG/RoleMapper)

## 📖 Inhaltsverzeichnis

1. [Übersicht](#-übersicht)
2. [Funktionen](#-funktionen)
3. [Technologie-Stack](#-technologie-stack)
4. [Projektstruktur](#-projektstruktur)
5. [Installation](#-installation)
6. [Nutzung](#-nutzung)
7. [Entwicklung](#-entwicklung)
8. [Contribution Guidelines](#-contribution-guidelines)
9. [Lizenz](#-lizenz)
10. [Kontakt](#-kontakt)
11. [Dokumentation](#-dokumentation)
12. [Team](#-team)

---

## 🔍 Übersicht

**RoleMapper** ist ein leistungsstarkes System von FlowCraft AG, das dynamisches Mapping von Rollen und Berechtigungen in Unternehmen ermöglicht. Es bietet eine moderne Benutzeroberfläche sowie ein skalierbares Backend, das effiziente Rechteverwaltung und Prozessoptimierung unterstützt.

---

## 🔧 Funktionen

- **Dynamisches Rollen-Mapping:** Rollen werden basierend auf Benutzerfunktionen und organisatorischen Strukturen dynamisch zugewiesen.
- **Zentrales Rechte-Management:** Intuitive Verwaltung von Berechtigungen.
- **Workflow-Integration:** Unterstützung von Genehmigungs- und Automatisierungsprozessen mithilfe von Camunda BPM.
- **Responsives UI:** Eine moderne, reaktionsschnelle Benutzeroberfläche mit Next.js und MUI (Material-UI).

---

## 🛠 Technologie-Stack

### Backend

- **Framework:** NestJS
- **Programmiersprache:** TypeScript
- **Datenbank:** MongoDB
- **Authentifizierung:** Keycloak
- **Workflow-Engine:** Camunda BPM

### Frontend

- **Framework:** Next.js
- **Programmiersprache:** TypeScript
- **UI-Bibliothek:** MUI (Material-UI)

---

## 📂 Projektstruktur

 ```plaintext
.
├── backend               # Backend-Code (NestJS)
│   ├── test              # Tests für das Backend
│   ├── log               # Log-Dateien des Backends
│   └── src               # Quellcode des Backends
│       ├── config        # Konfigurationsdateien
│       ├── logger        # Logging-Funktionalität
│       ├── role-mapper   # Hauptlogik für das Rollen-Mapping
│       │   ├── controller  # API-Endpunkte
│       │   ├── error       # Fehlerbehandlung
│       │   ├── model       # Datenmodelle
│       │   │   ├── dto       # Data Transfer Objects
│       │   │   ├── entity    # Datenbank-Entitäten
│       │   │   ├── enum      # Enumerationen
│       │   │   ├── input     # GraphQL-Inputs
│       │   │   ├── payload   # Antwort-Payloads
│       │   │   └── types     # Allgemeine Typdefinitionen
│       │   ├── resolver    # GraphQL-Resolver
│       │   ├── service     # Geschäftliche Logik
│       │   └── utils       # Hilfsfunktionen
│       └── security       # Sicherheitsrelevanter Code
│           ├── http        # HTTP-Sicherheitskonfiguration
│           └── keycloak    # Keycloak-Integration
├── docs                  # Dokumentation
│   ├── backend           # Backend-Dokumentation
│   └── frontend          # Frontend-Dokumentation
├── .extras               # Zusätzliche Konfigurationsdateien
│   ├── camunda           # BPMN- und DMN-Dateien für Camunda
│   ├── compose           # Docker-Compose-Konfigurationen
│   │   ├── backend       # Docker-Compose.yaml für das Backend
│   │   └── frontend      # Docker-compose für das Frontend
│   ├── doc               # Zusätzliche Dokumentationen
│   ├── postman           # Postman-Sammlungen
│   └── volumes           # Persistente Daten
│       └── keys          # Zertifikate und Schlüssel
│           └── keycloak.p12
├── frontend              # Frontend-Code (Next.js)
│   ├── public            # Statische Dateien
│   └── src               # Quellcode des Frontends
│       ├── app           # App-Routing
│       ├── components    # Wiederverwendbare UI-Komponenten
│       ├── graphql       # GraphQL-Anfragen und Mutationen
│       │   ├── mutations   # Mutationen
│       │   └── queries     # Abfragen
│       ├── lib           # Hilfsfunktionen
│       ├── styles        # Stile und CSS-Dateien
│       ├── types         # Typdefinitionen
│       └── utils         # Hilfsfunktionen
└── .volumes              # Persistente Daten
    ├── keycloak          # Keycloak-Daten
    └── keys              # Zertifikate für TLS
```

---

## 📥 Installation

### Voraussetzungen

#### Docker Desktop installieren

- **Windows/Mac:**
  Lade [Docker Desktop](https://www.docker.com/products/docker-desktop) herunter und installiere es.
- **Linux:**
  Installiere Docker mit:

  ```bash
  sudo apt-get update
  sudo apt-get install docker-ce docker-ce-cli containerd.io
  ```

### Installationsanleitung

1. **Repository klonen:**

   ```bash
   git clone https://github.com/flowcraft-ag/rolemapper.git
   cd rolemapper
   ```

2. **Abhängigkeiten installieren:**
   - **Backend:**

     ```bash
     cd backend
     npm install
     ```

   - **Frontend:**

     ```bash
     cd ../frontend
     npm install
     ```

3. **Schlüssel und Zertifikate erstellen:**

   1. **Erstelle den Ordner `.volumes/keys` (falls nicht vorhanden):**

      ```bash
      mkdir -p .volumes/keys
      ```

   2. **TLS-Schlüssel und -Zertifikate erstellen:**
      - **Mac/Linux:**

        ```bash
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout .volumes/keys/key.pem -out .volumes/keys/certificate.crt
        ```

      - **Windows (PowerShell):**

        ```powershell
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout .volumes/keys/key.pem -out .volumes/keys/certificate.crt
        ```

   3. **Konvertiere `.crt` und `.pem` in `.p12` für Keycloak:**

      ```bash
      openssl pkcs12 -export -in .volumes/keys/certificate.crt -inkey .volumes/keys/key.pem -out .volumes/keys/keycloak.p12 -name keycloak -passout pass:changeit
      ```

4. **Umgebungsvariablen konfigurieren:**
   - **Backend (.env):**

     ```bash
     MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
     MONGODB_DATABASE=<database>
     ```

   - **Frontend (.env.local):**

     ```bash
     KEYCLOAK_CLIENT_ID=<keycloak-client-id>
     KEYCLOAK_CLIENT_SECRET=<keycloak-client-secret>
     KEYCLOAK_ISSUER=<issuer-url>
     NEXTAUTH_URL=http://localhost:4000
     NEXTAUTH_SECRET=<next-auth-secret>
     NEXT_PUBLIC_BACKEND_SERVER_URL=https://localhost:3000
     ```

5. **Server starten:**
   - **Nur Backend starten:**

     ```bash
     cd .extras/compose/backend
     docker compose up -d
     ```

   - **Nur Frontend starten:**

     ```bash
     cd .extras/compose/frontend
     docker compose up -d
     ```

   - **Gesamte Anwendung starten:**

     ```bash
     cd .extras/compose
     docker compose up -d
     ```

---

## 🚀 Nutzung

1. Öffne das Frontend unter `http://localhost:4000`.
2. Melde dich mit einem in Keycloak definierten Benutzer an.
3. Beginne mit der Verwaltung von Rollen und Berechtigungen.

---

## 🛠 Entwicklung

- **Backend testen:**
  - **Normale Tests:**

    ```bash
    cd backend
    npm t
    ```

  - **Tests mit Coverage:**

    ```bash
    npm run test:istanbul
    ```

- **Frontend testen:**

  ```bash
  cd frontend
  npm t
  ```

- **Code analysieren (ESLint):**

  ```bash
  npm run eslint
  ```

- **Code formatieren (Prettier):**

  ```bash
  npm run prettier
  ```

---

## 🤝 Contribution Guidelines

1. **Forke das Repository.**
2. **Erstelle einen neuen Branch.**
3. **Führe Änderungen durch und committe diese.**
4. **Sende einen Pull Request.**

---

## 📞 Kontakt

- **FlowCraft AG**
- [Website](https://www.flowCraft.de)
- [Support](mailto:support@flowCraft.de)

---

## 📚 Dokumentation

📖 [GitHub Pages](https://FlowCraft-AG.github.io/RoleMapper/)

---

## 👩‍💻 Team

Dieses Projekt wurde von den folgenden Personen entwickelt:

- **Caleb** - [caleb@flowCraft.de](mailto:caleb@flowCraft.de)
- **Melina** - [melina@flowCraft.de](mailto:melina@flowCraft.de)
- **An** - [an@flowCraft.de](mailto:an@flowCraft.de)
- **Oliver** - [oliver@flowCraft.de](mailto:oliver@flowCraft.de)
- **David** - [david@flowCraft.de](mailto:david@flowCraft.de)
