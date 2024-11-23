# RoleMapper by FlowCraft AG

## Projektübersicht

RoleMapper ist ein modernes System von FlowCraft AG, das die dynamische Zuordnung (Mapping) von Rollen auf Basis von Funktionen und organisatorischen Strukturen ermöglicht. Es bietet eine flexible Plattform für die Verwaltung von Berechtigungen und die Automatisierung von Prozessen wie Genehmigungen.

## Funktionen

- **Dynamisches Rollen-Mapping:** Automatische Zuweisung von Rollen an Benutzer basierend auf Funktionen.
- **Flexibles Rechte-Management:** Verknüpfung von Berechtigungen mit spezifischen Workflows und Prozessen.
- **Workflow-Integration:** Unterstützung für komplexe Genehmigungs- und Automatisierungsprozesse.
- **Benutzerfreundliche Oberfläche:** Visualisierung von Benutzer-, Rollen- und Funktionszuweisungen in einem Active Directory-ähnlichen Stil.

## Technologie-Stack

### Backend

- **Datenbank:** MongoDB
- **Framework:** Spring Boot
- **Programmiersprache:** Java
- **Build-Tool:** Maven
- **Authentifizierung:** Keycloak
- **Workflow-Engine:** Camunda BPM

### Frontend

- **Framework:** Next.js
- **Programmiersprache:** TypeScript
- **CSS-Framework:** Tailwind CSS

## Installation

### Voraussetzungen

- Java 11 oder höher
- Maven
- Node.js und npm
- MongoDB
- Keycloak-Server
- Camunda BPM

### Backend

1. Repository klonen:
   ```bash
   git clone https://github.com/flowcraft-ag/rolemapper.git
   ```
2. In das Backend-Verzeichnis wechseln:
   ```bash
   cd rolemapper/backend
   ```
3. Abhängigkeiten installieren und das Projekt bauen:
   ```bash
   mvn clean install
   ```
4. Anwendung starten:
   ```bash
   mvn spring-boot:run
   ```

### Frontend

1. In das Frontend-Verzeichnis wechseln:
   ```bash
   cd ../frontend
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. Anwendung starten:
   ```bash
   npm run dev
   ```

## Konfiguration

- **Keycloak:** Richte Benutzer, Rollen und Berechtigungen entsprechend den Anforderungen ein.
- **Camunda:** Implementiere und konfiguriere Workflows für automatisierte Prozesse.

## Nutzung

Starte das Frontend und öffne `http://localhost:3000`, um RoleMapper zu verwenden. Melde dich mit einem in Keycloak definierten Benutzerkonto an.

## Beitrag leisten

Wir freuen uns über Beiträge! Forke das Repository, implementiere Änderungen und erstelle einen Pull-Request.

## Lizenz

RoleMapper steht unter der MIT-Lizenz. Weitere Details findest du in der Datei `LICENSE`.
