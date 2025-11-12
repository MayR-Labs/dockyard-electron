# **Dockyard Features**

Dockyard is a desktop environment for your web apps — fast, flexible, and completely open-source.
This document lists current, planned, and experimental features of the project.

---

## 🧩 **Core Features**

### **Profiles**

- Create multiple profiles (like separate browsers).
- Launch multiple app instances under different profiles simultaneously.
- Each profile maintains its own apps, sessions, and themes.

### **Workspaces**

- Group related apps under one workspace (e.g., “Design”, “Research”, “Marketing”).
- Optionally share sessions between apps within a workspace.
- Workspace-level settings for layout, theme, and hibernation.
- Quick switching between workspaces.

### **App Collection**

- Curated list of popular apps (e.g., WhatsApp, Gmail, Figma, ChatGPT).
- Add **unlimited** custom apps by URL.
- Auto-fetch favicon and metadata.
- Replace or upload custom icons easily.

### **Multi-App Instances**

- Create multiple instances of the same app (for multiple accounts).
- Separate sessions per instance to prevent login clashes.

### **Custom Apps**

- Define your own app entries with name, URL, icon, and optional CSS/JS overrides.
- Detect and apply site favicon automatically.
- Ability to inject custom CSS for cleaner UIs.

---

## 🧠 **Session & Performance**

### **Session Management**

- Each app runs in an isolated Electron `partition`.
- Shared session option for workspaces (for connected workflows).
- Clear session cache, cookies, or storage per app.

### **Auto-Hibernation**

- Automatically pause inactive apps after 15 minutes (default).
- Customisable idle time per app or per workspace.
- Smart resume: instantly wakes when the user switches back.

---

## 🎨 **Customisation**

- Fully customisable app dock — place icons on top, bottom, left, or right.
- Change app ordering via drag-and-drop.
- Adjustable zoom level per app.
- Choose between **light**, **dark**, or **system** theme.
- Theme accent colours and background styles (glass, solid, minimal).

---

## 🔔 **Notifications**

- Native OS notifications via Electron API.
- Optional per-app notification badges.
- Global “Do Not Disturb” toggle.

---

## 🧭 **Layout & Flexibility**

- Tile multiple apps side-by-side (tab tiling).
- Save and restore split layouts.
- Detachable windows for any app.
- Resizable and floating panels.

---

## 🗂️ **Persistence**

- Local-first storage (no internet needed).
- All profiles, workspaces, and settings stored in JSON via `electron-store`.
- Local backups and easy restore.

---

## 🧰 **Developer Mode**

- DevTools toggle per app.
- Custom JS injection for debugging or enhancement.
- Debug console for monitoring IPC events and webview states.

---

## 🔒 **Privacy & Security**

- No telemetry, tracking, or analytics.
- Local storage only — your data never leaves your machine.
- Optional sandbox mode for higher isolation.

---

## 🧠 **Productivity Utilities** _(planned)_

- Focus Mode — temporarily hide or mute distracting apps.
- Quick Launcher (Ctrl/Cmd + Space).
- Automation Hooks — define small rules (e.g., auto-mute music when in meetings).
- Workspace templates (preconfigured app sets).

---

## 🧳 **Backup & Sync**

- Local backup/restore to JSON or ZIP.
- Folder-based sync (Dropbox, Google Drive, etc.) — no central server.
- Import/export profile settings and app setups.

---

## 🧪 **Experimental Features (Future Plans)**

- App Store: discover and install community-contributed apps.
- Custom Theming Engine: build or share theme packs.
- Cross-instance collaboration (share workspace state over LAN).
- Plugin API: extend Dockyard with external scripts or features.

---

## ⚙️ **Status Legend**

| Symbol | Meaning      |
| :----- | :----------- |
| ✅     | Implemented  |
| 🚧     | In progress  |
| 🧪     | Experimental |
| 🗓️     | Planned      |

---

## 💬 **Final Note**

Dockyard isn’t trying to be yet another “universal app hub.”
It’s meant to be your personal dockyard — where every tool, tab, and workflow fits _your_ design.
