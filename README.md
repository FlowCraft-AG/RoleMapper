# **RoleMapper** by FlowCraft AG

![Auto Assign](https://github.com/FlowCraft-AG/demo-repository/actions/workflows/auto-assign.yml/badge.svg)
![Proof HTML](https://github.com/FlowCraft-AG/demo-repository/actions/workflows/proof-html.yml/badge.svg)

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
rolemapper/
├── backend/           # NestJS Backend
│   ├── src/           # Quellcode des Backends
│   ├── test/          # Tests für das Backend
│   └── package.json   # Abhängigkeiten des Backends
├── frontend/          # Next.js Frontend
│   ├── pages/         # Next.js-Seiten
│   ├── components/    # Wiederverwendbare UI-Komponenten
│   └── package.json   # Abhängigkeiten des Frontends
├── shared/            # Geteilter Code (z. B. Typen oder Utils)
└── docker-compose.yml # Docker-Setup für lokale Entwicklung
```

---

## 📥 Installation

### Voraussetzungen
- **Node.js:** Version 18 oder höher
- **Docker:** Für die lokale Entwicklung mit `docker-compose`
- **MongoDB:** Zugang zu einer MongoDB-Instanz (z. B. MongoDB Atlas)

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

3. **Umgebungsvariablen konfigurieren:**
   Erstelle eine `.env`-Datei für Backend und Frontend. Beispiel für das Backend:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   ```

4. **Anwendung starten:**
   - Mit Docker:
     ```bash
     docker-compose up
     ```
   - Ohne Docker:
     - **Backend starten:**
       ```bash
       cd backend
       npm run start:dev
       ```
     - **Frontend starten:**
       ```bash
       cd ../frontend
       npm run dev
       ```

---

## ⚙️ Konfiguration

1. **Backend:**
   - Bearbeite die Datei `.env` im `backend`-Verzeichnis, um die MongoDB-URI und andere Variablen festzulegen.

2. **Frontend:**
   - Bearbeite die Datei `.env.local` im `frontend`-Verzeichnis, um die API-URL des Backends anzugeben:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:4000/api
     ```

---

## 🚀 Nutzung

1. Öffne das Frontend unter `http://localhost:3000`.
2. Melde dich mit einem in Keycloak definierten Benutzer an.
3. Beginne mit der Verwaltung von Rollen und Berechtigungen.

---

## 🛠 Entwicklung

- **Backend testen:**
  ```bash
  cd backend
  npm test
  ```
- **Frontend testen:**
  ```bash
  cd frontend
  npm test
  ```
- **Geteilter Code:** Teile Typen und Hilfsfunktionen im Ordner `shared/`.

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
- [Website](https://www.flowcraft-ag.de)
- [Support](mailto:support@flowcraft-ag.de)
