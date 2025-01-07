# Frontend README

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
Das Frontend des **RoleMapper**-Projekts ist eine moderne Webanwendung, die mit **Next.js** und **TypeScript** entwickelt wurde. Es verwendet **MUI (Material-UI)** für die Benutzeroberfläche und bietet eine intuitive Plattform für die Verwaltung von Rollen und Berechtigungen. Diese Anleitung hilft dir, das Frontend lokal einzurichten, zu starten und anzupassen.

---

## Funktionen
- **Benutzerfreundliche Oberfläche**: Intuitives und modernes Design mit MUI.
- **Responsives Design**: Optimiert für Mobil- und Desktop-Geräte.
- **Integration mit Backend**: Kommuniziert mit dem Backend über GraphQL.

---

## Technologie-Stack
- **Framework**: Next.js
- **Programmiersprache**: TypeScript
- **UI-Bibliothek**: MUI (Material-UI)
- **API-Kommunikation**: GraphQL

---

## Projektstruktur
```plaintext
frontend
├── public            # Statische Dateien
└── src               # Quellcode des Frontends
    ├── app           # App-Routing
    ├── components    # Wiederverwendbare UI-Komponenten
    ├── graphql       # GraphQL-Anfragen und Mutationen
    ├── lib           # Hilfsfunktionen
    ├── styles        # Stile und CSS-Dateien
    ├── types         # Typdefinitionen
    └── utils         # Hilfsfunktionen
```

---

## Setup

### Voraussetzungen
- **Node.js**: Version 22.x oder höher
- **npm**: Version 8.x oder höher

### Schritte

1. **Repository klonen:**
   ```bash
   git clone https://github.com/FlowCraft-AG/RoleMapper.git
   cd RoleMapper/frontend
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren:**
   - Erstelle eine Datei `.env.local` im Verzeichnis `frontend` mit folgendem Inhalt:
     ```env
     NEXT_PUBLIC_BACKEND_SERVER_URL=https://localhost:3000
     NEXTAUTH_URL=https://localhost:4000
     NEXTAUTH_SECRET=<dein-geheimer-Schlüssel>
     KEYCLOAK_CLIENT_ID=<keycloak-client-id>
     KEYCLOAK_ISSUER=<keycloak-issuer-url>
     ```

---

## Nutzung

### Entwicklungsmodus
Starte die Anwendung mit dem Entwicklungsserver:
```bash
npm run dev
```
Die Anwendung ist unter `http://localhost:4000` erreichbar.

### Produktionsmodus
Baue das Projekt und starte es im Produktionsmodus:
```bash
npm run build
npm start
```

### TLS-Unterstützung (Optional)
Falls du TLS verwenden möchtest, starte den Server im TLS-Modus:
```bash
npm run dev:tls
```

---

## Entwicklung

- **Code-Analyse:**
  ```bash
  npm run eslint
  ```

- **Tests ausführen:**
  ```bash
  npm test
  ```

- **Formatierung prüfen:**
  ```bash
  npm run prettier
  ```

---

## Dokumentation

Die detaillierte Dokumentation des Projekts findest du unter:
[GitHub Pages](https://FlowCraft-AG.github.io/RoleMapper/)

---
