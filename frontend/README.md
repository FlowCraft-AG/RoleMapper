# RoleMapper Frontend

Das **RoleMapper Frontend** ist die Benutzeroberfläche, mit der Rollen und Berechtigungen verwaltet werden können. Es basiert auf Next.js und Bootstrap und ist vollständig responsive.

---

## 📋 Voraussetzungen

- **Node.js:** Version v23.3.0
- **CSS-Framework:** Bootstrap 5
- **Keycloak:** Authentifizierungsserver

---

## 🚀 Installation

### 1. Repository klonen
```bash
git clone https://github.com/flowcraft-ag/rolemapper.git
```

### 2. In das Frontend-Verzeichnis wechseln
```bash
cd rolemapper/frontend
```

### 3. Abhängigkeiten installieren
```bash
npm install
```

### 4. Bootstrap einbinden
- Bootstrap ist bereits über NPM installiert.
- Stelle sicher, dass es in `_app.tsx` importiert ist:
  ```javascript
  import 'bootstrap/dist/css/bootstrap.min.css';
  ```

### 5. Entwicklung starten
```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) verfügbar.

---

## ⚙️ Konfiguration

### Keycloak
1. Stelle sicher, dass dein Keycloak-Server läuft.
2. Füge die Keycloak-Konfigurationsdetails in die Datei `.env.local` ein:
   ```env
   NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080/auth
   NEXT_PUBLIC_KEYCLOAK_REALM=rolemapper
   NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=rolemapper-client
   ```

---

## 📐 Projektstruktur

```plaintext
├── components       # Wiederverwendbare UI-Komponenten
├── pages            # Seiten und Routen
├── public           # Statische Dateien (Bilder, Icons)
├── styles           # Globale und modulare Stylesheets
└── utils            # Hilfsfunktionen und API-Helper
```

---

## 🔧 Befehle

- **Entwicklung starten:** `npm run dev`
- **Produktions-Build erstellen:** `npm run build`
- **Server starten:** `npm run start`
- **Tests ausführen:** `npm run test`

---

## 💻 Technologien

- **Framework:** Next.js
- **Programmiersprache:** TypeScript
- **CSS-Framework:** Bootstrap 5
- **Auth:** Keycloak
- **Node.js-Version:** v23.3.0

---

## 📞 Kontakt

FlowCraft AG  
[Website](https://www.flowcraft-ag.de)  
[Support](mailto:support@flowcraft-ag.de)

---

