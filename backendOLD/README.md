# RoleMapper Backend

Das **RoleMapper Backend** bildet die Grundlage für das Rollen- und Berechtigungsmanagement. Es basiert auf Spring Boot und MongoDB und bietet Schnittstellen für dynamisches Rollen-Mapping, Workflow-Integration und zentrale Rechteverwaltung.

---

## 📋 Voraussetzungen

- **Java:** Version 23
- **Maven:** Version 3.9.9
- **Datenbank:** MongoDB (Cloud-Instanz)
- **Workflow-Engine:** Camunda BPM
- **Authentication-Server:** Keycloak

---

## 🚀 Installation

### 1. Repository klonen
```bash
git clone https://github.com/flowcraft-ag/rolemapper.git
```

### 2. In das Backend-Verzeichnis wechseln
```bash
cd rolemapper/backend
```

### 3. Abhängigkeiten installieren und Projekt bauen
```bash
mvn clean install
```

### 4. Konfiguration

#### MongoDB
- Erstelle eine `application.properties`-Datei im Verzeichnis `src/main/resources` (falls nicht vorhanden).
- Füge folgende Zeilen hinzu:
  ```properties
  spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
  ```
  Ersetze `<username>`, `<password>`, `<cluster-url>` und `<database>` durch deine MongoDB-Cloud-Daten.

#### Keycloak
- Stelle sicher, dass Keycloak läuft und konfiguriert ist (Benutzer, Rollen, Clients).
- Füge die Keycloak-Server-Details in die `application.properties` ein:
  ```properties
  keycloak.auth-server-url=http://localhost:8080/auth
  keycloak.realm=rolemapper
  keycloak.resource=rolemapper-client
  ```

### 5. Anwendung starten
```bash
mvn spring-boot:run
```

---

## 📡 API-Endpunkte

### Authentifizierung
- **POST** `/auth/login`: Benutzeranmeldung

### Rollen und Berechtigungen
- **GET** `/roles`: Liste aller Rollen
- **POST** `/roles`: Neue Rolle erstellen

### Workflows
- **POST** `/workflows/start`: Workflow starten

> Eine vollständige API-Dokumentation findest du in der Datei `openapi.yaml`.

---

## 🛠 Technologien

- **Datenbank:** MongoDB (Cloud-Instanz)
- **Framework:** Spring Boot
- **Workflow-Engine:** Camunda BPM
- **Authentifizierung:** Keycloak
- **Build-Tool:** Maven

---

## 🛡 Sicherheit

- OAuth2-Authentifizierung über Keycloak.
- Sensible Daten sind in der `application.properties` verschlüsselt.

---

## 📞 Kontakt

FlowCraft AG  
[Website](https://www.flowcraft-ag.de)  
[Support](mailto:support@flowcraft-ag.de)

---

