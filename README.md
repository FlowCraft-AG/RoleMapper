# **RoleMapper** by FlowCraft AG

![Auto Assign](https://github.com/FlowCraft-AG/demo-repository/actions/workflows/auto-assign.yml/badge.svg)
![Proof HTML](https://github.com/FlowCraft-AG/demo-repository/actions/workflows/proof-html.yml)

## 📖 Inhaltsverzeichnis

1. [Übersicht](#-übersicht)
2. [Funktionen](#-funktionen)
3. [Technologie-Stack](#-technologie-stack)
4. [Projektstruktur](#-projektstruktur)
5. [Installation](#-installation)
6. [Konfiguration](#-konfiguration)
7. [Nutzung](#-nutzung)
8. [Entwicklung](#-entwicklung)
9. [Contribution Guidelines](#-contribution-guidelines)
10. [Lizenz](#-lizenz)
11. [Kontakt](#-kontakt)
12. [Dokumentation](#-dokumentation)
13. [Team](#-team)

---

## 🔍 Übersicht

**RoleMapper** ist ein innovatives System von FlowCraft AG, das dynamisches Mapping von Rollen und Berechtigungen in Unternehmen ermöglicht. Mit einer modernen Benutzeroberfläche und einem skalierbaren Backend hilft es, Rechte effizient zu verwalten und Prozesse zu optimieren.

---

## ⚙️ Funktionen

- **Dynamisches Rollen-Mapping:** Automatische Zuweisung basierend auf Benutzerfunktionen und Workflows.
- **Zentrales Rechte-Management:** Effiziente Verwaltung von Berechtigungen.
- **Workflow-Integration:** Unterstützt Genehmigungs- und Automatisierungsprozesse durch Camunda BPM.
- **Responsives UI:** Moderne Benutzeroberfläche mit Next.js und Bootstrap.

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
- **CSS-Framework:** Bootstrap 5

---

## 📂 Projektstruktur

```
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
│   │   ├── backend
│   │   ├── frontend
│   │   ├── sonarqube
│   │   ├── zebee
│   │   └── zipkin
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
  ```
  sudo apt-get update
  sudo apt-get install docker-ce docker-ce-cli containerd.io
  ```

### Installationsanleitung

1. **Repository klonen:**
   ```
   git clone https://github.com/flowcraft-ag/rolemapper.git
   cd rolemapper
   ```

2. **Abhängigkeiten installieren:**
   - **Backend:**
     ```
     cd backend
     npm install
     ```
   - **Frontend:**
     ```
     cd ../frontend
     npm install
     ```

3. **Schlüssel und Zertifikate erstellen:**
   - **Mac/Linux:**
     ```
     openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout .volumes/keys/key.pem -out .volumes/keys/certificate.crt
     ```
   - **Windows (PowerShell):**
     ```
     openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout .volumes/keys/key.pem -out .volumes/keys/certificate.crt
     ```

   Lege die erstellten Dateien in den Ordner `.volumes/keys`.

4. **Umgebungsvariablen konfigurieren:**
   - **Backend (.env):**
     ```
     MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
     MONGODB_DATABASE=<database>
     ```
   - **Frontend (.env.local):**
     ```
     KEYCLOAK_CLIENT_ID=<keycloak-client-id>
     KEYCLOAK_CLIENT_SECRET=<keycloak-client-secret>
     KEYCLOAK_ISSUER=<issuer-url>
     NEXTAUTH_URL=http://localhost:4000
     NEXTAUTH_SECRET=<next-auth-secret>
     NEXT_PUBLIC_BACKEND_SERVER_URL=https://localhost:3000
     ```

5. **Server starten:**
   - **Nur Backend starten:**
     ```
     cd .extras/compose/backend
     docker compose up -d
     ```
   - **Nur Frontend starten:**
     ```
     cd .extras/compose/frontend
     docker compose up -d
     ```
   - **Gesamte Anwendung starten:**
     ```
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
    ```
    cd backend
    npm t
    ```
  - **Tests mit Coverage:**
    ```
    npm run test:istanbul
    ```
- **Frontend testen:**
  ```
  cd frontend
  npm t
  ```
- **Code analysieren (ESLint):**
  ```
  npm run eslint
  ```
- **Code formatieren (Prettier):**
  ```
  npm run prettier
  ```

---

## 🤝 Contribution Guidelines

1. **Forke das Repository.**
2. **Erstelle einen neuen Branch.**
3. **Führe Änderungen durch und committe diese.**
4. **Sende einen Pull Request.**

---

## 📜 Lizenz

**RoleMapper** steht unter der [MIT-Lizenz](LICENSE).

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
