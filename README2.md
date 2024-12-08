![Auto Assign](https://github.com/FlowCraft-AG/demo-repository/actions/workflows/auto-assign.yml/badge.svg)

![Proof HTML](https://github.com/FlowCraft-AG/demo-repository/actions/workflows/proof-html.yml/badge.svg)

# RoleMapper by FlowCraft AG

## 📖 Inhaltsverzeichnis
1. [Übersicht](#-übersicht)
2. [Funktionen](#-funktionen)
3. [Technologie-Stack](#-technologie-stack)
4. [Installation](#-installation)
5. [Konfiguration](#-konfiguration)
6. [Nutzung](#-nutzung)
7. [Team](#-team)
8. [Contribution Guidelines](#-contribution-guidelines)
9. [Lizenz](#-lizenz)
10. [Kontakt](#-kontakt)

---

## 🔍 Übersicht

**RoleMapper** ist ein fortschrittliches System von FlowCraft AG, das dynamisches Mapping von Rollen und Funktionen in Unternehmen ermöglicht. Es kombiniert eine intuitive Benutzeroberfläche mit einer leistungsstarken Backend-Architektur, um Berechtigungen und Prozesse flexibel und effizient zu verwalten. Dank Bootstrap ist das UI einfach und schnell gestaltbar.

---

## ⚙️ Funktionen

- **Dynamisches Rollen-Mapping:** Automatische Zuweisung von Rollen basierend auf Benutzerfunktionen und organisatorischen Prozessen.
- **Zentrales Rechte-Management:** Verwaltung von Berechtigungen durch präzises Mapping auf Funktionen und Workflows.
- **Workflow-Integration:** Unterstützung für Genehmigungs- und Automatisierungsprozesse durch Camunda BPM.
- **Responsive Benutzeroberfläche:** Einfaches und funktionales UI mit Bootstrap-Komponenten.

---

## 🛠 Technologie-Stack

### Backend
- **Datenbank:** MongoDB (Cloud-Instanz)
- **Framework:** Spring Boot
- **Programmiersprache:** Java 23
- **Build-Tool:** Maven 3.9.9
- **Authentifizierung und Autorisierung:** Keycloak
- **Workflow-Engine:** Camunda BPM

### Frontend
- **Framework:** Next.js
- **Programmiersprache:** TypeScript
- **CSS-Framework:** Bootstrap 5
- **Node.js-Version:** v23.3.0

---

## 📥 Installation

### Voraussetzungen
- **Java:** Version 23
- **Maven:** Version 3.9.9
- **Node.js:** Version v23.3.0
- **Datenbank:** MongoDB (Cloud-Instanz, z. B. MongoDB Atlas)
- **Authentication-Server:** Keycloak
- **Workflow-Engine:** Camunda BPM

### Installationsanleitung

#### Backend
1. **Repository klonen:**
   ```bash
   git clone https://github.com/flowcraft-ag/rolemapper.git
   ```
2. **In das Backend-Verzeichnis wechseln:**
   ```bash
   cd rolemapper/backend
   ```
3. **Abhängigkeiten installieren und Projekt bauen:**
   ```bash
   mvn clean install
   ```
4. **Konfiguriere MongoDB-Cloud-Verbindung:**
   - Erstelle eine `application.properties`-Datei im Verzeichnis `src/main/resources` (falls nicht vorhanden).
   - Füge folgende Zeilen hinzu:
     ```properties
     spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
     ```
   - Ersetze `<username>`, `<password>`, `<cluster-url>` und `<database>` durch deine MongoDB-Cloud-Daten.

5. **Anwendung starten:**
   ```bash
   mvn spring-boot:run
   ```

#### Frontend
1. **In das Frontend-Verzeichnis wechseln:**
   ```bash
   cd ../frontend
   ```
2. **Bootstrap installieren:**
   ```bash
   npm install bootstrap
   ```
3. **Bootstrap einbinden:**
   Füge die folgende Zeile in `_app.tsx` oder `_app.jsx` hinzu:
   ```javascript
   import 'bootstrap/dist/css/bootstrap.min.css';
   ```
4. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```
5. **Anwendung starten:**
   ```bash
   npm run dev
   ```

---

## 🔧 Konfiguration

1. **Keycloak:**
   - Richte Benutzer, Rollen und Clients entsprechend den Anforderungen ein.
   - Definiere Berechtigungen und Zugriffsregeln im Keycloak-Admin-Panel.

2. **Camunda:**
   - Erstelle Workflows im Camunda Modeler und importiere sie in die Engine.
   - Konfiguriere Prozessdefinitionen und Genehmigungsworkflows.

---

## 🚀 Nutzung

1. **Zugriff auf das Frontend:**
   - Öffne `http://localhost:3000` in deinem Browser.
   - Melde dich mit einem in Keycloak definierten Benutzerkonto an.

2. **Verwaltung:**
   - Über die Benutzeroberfläche kannst du Rollen, Funktionen und Rechte dynamisch verwalten.

---

## 👥 Team

RoleMapper wurde mit Leidenschaft von unserem Team bei FlowCraft AG entwickelt:

- 🎯 **Projektmanager:** [Name des Projektmanagers]
- 💻 **Backend-Entwickler:** [Name des Backend-Entwicklers]
- 🌐 **Frontend-Entwickler:** [Name des Frontend-Entwicklers]
- 🎨 **UX/UI-Designer:** [Name des Designers]
- 🚀 **DevOps-Ingenieur:** [Name des DevOps-Ingenieurs]
- ✅ **Qualitätssicherung:** [Name des QA-Verantwortlichen]

Möchtest du Teil unseres Teams werden? Besuche unsere [Karriereseite](https://www.flowcraft-ag.de/jobs).

---

## 🤝 Contribution Guidelines

Wir freuen uns über Beiträge zur Weiterentwicklung von RoleMapper. Bitte halte dich an die folgenden Richtlinien:

1. **Forke das Repository.**
2. **Erstelle einen neuen Branch für deine Änderungen.**
3. **Führe deine Änderungen aus und schreibe verständliche Commit-Messages.**
4. **Sende einen Pull-Request mit einer klaren Beschreibung deiner Änderungen.**

---

## 📜 Lizenz

**RoleMapper** steht unter der [MIT-Lizenz](LICENSE). Sie erlaubt die freie Nutzung, Veränderung und Verbreitung des Codes, solange die Lizenzbedingungen eingehalten werden.

---

## 📞 Kontakt

- **FlowCraft AG**
- [Website](https://www.flowcraft-ag.de)
- [Support](mailto:support@flowcraft-ag.de)

---



src/
└── model/
    ├── types/        # Allgemeine Typdefinitionen (z. B. Enums oder string union types)
    ├── inputs/       # Eingabeobjekte für GraphQL oder REST (z. B. Filter, Pagination, etc.)
    ├── dtos/         # Datenobjekte für die Kommunikation zwischen Schichten
    ├── entity/       # Definitionen der Entitäten (Datenbank- oder API-Entitäten)
    ├── payload/      # Rückgabe-Objekte und Payloads (z. B. Ergebnisse von Queries oder Mutationen)
